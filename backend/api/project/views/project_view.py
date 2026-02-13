from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.utils import timezone
from api.shared.views.base_api_view import BaseAPIView
from api.project.serializers.project_serializer import (
    ProjectCreateRequestSerializer,
    ProjectResponseSerializer,
    ProjectListResponseSerializer,
    ProjectDetailResponseSerializer,
    ProjectUpdateRequestSerializer,
    LatexDocumentSerializer,
)
from app.models.problem import Problem
from app.models.problem_latex_document import ProblemLatexDocument
from app.models.explanation import Explanation
from app.utils.file_storage import FileStorage


class ProjectListView(BaseAPIView):
    """
    プロジェクト一覧取得用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="プロジェクト一覧取得",
        description="認証済みユーザーのプロジェクト一覧を取得します",
        responses={200: ProjectListResponseSerializer(many=True)},
    )
    def get(self, request):
        """
        プロジェクト一覧を取得（削除済みは除外）
        """
        problems = Problem.objects.filter(
            user=request.user,
            deleted_at__isnull=True
        ).order_by('-updated_at')

        serializer = ProjectListResponseSerializer(
            [
                {
                    "id": problem.id,
                    "title": problem.title,
                    "created_at": problem.created_at,
                    "updated_at": problem.updated_at,
                }
                for problem in problems
            ],
            many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectCreateView(BaseAPIView):
    """
    プロジェクト作成用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="プロジェクト作成",
        description="新しいプロジェクトを作成します",
        request=ProjectCreateRequestSerializer,
        responses={201: ProjectResponseSerializer},
    )
    def post(self, request):
        """
        新しいプロジェクトを作成
        """
        serializer = ProjectCreateRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        title = serializer.validated_data["title"]

        problem = Problem.objects.create(
            user=request.user,
            title=title,
            original_image_path=""
        )

        self.log_info(f"プロジェクト作成成功: {problem.id}")

        response_serializer = ProjectResponseSerializer({
            "id": problem.id,
            "title": problem.title,
            "created_at": problem.created_at,
            "updated_at": problem.updated_at,
        })

        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )


class ProjectRetrieveView(BaseAPIView):
    """
    プロジェクト取得用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="プロジェクト取得",
        description="プロジェクトの詳細情報を取得します（LaTeX、画像、PDFを含む）",
        responses={200: ProjectDetailResponseSerializer},
    )
    def get(self, request, pk):
        """
        プロジェクトの詳細情報を取得
        """
        try:
            problem = Problem.objects.select_related(
                'user').get(id=pk, deleted_at__isnull=True)
        except Problem.DoesNotExist:
            return Response(
                {"error": "プロジェクトが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        if problem.user != request.user:
            return Response(
                {"error": "このプロジェクトへのアクセス権限がありません"},
                status=status.HTTP_403_FORBIDDEN,
            )

        image_url = None
        if problem.original_image_path:
            image_url = FileStorage.get_file_url(problem.original_image_path)

        latest_latex_doc = ProblemLatexDocument.objects.select_related('problem').filter(
            problem=problem
        ).order_by('-version').first()

        latest_latex_document_data = None
        if latest_latex_doc:
            pdf_url = None
            if latest_latex_doc.pdf_path:
                pdf_url = FileStorage.get_file_url(latest_latex_doc.pdf_path)

            latest_latex_document_data = {
                "id": latest_latex_doc.id,
                "latex_code": latest_latex_doc.latex_code,
                "pdf_url": pdf_url,
                "version": latest_latex_doc.version,
                "is_confirmed": latest_latex_doc.is_confirmed,
                "created_at": latest_latex_doc.created_at,
            }

        # 最新の解説ドキュメントを取得
        latest_explanation_doc = Explanation.objects.select_related('problem').filter(
            problem=problem
        ).order_by('-version').first()

        latest_explanation_document_data = None
        if latest_explanation_doc:
            pdf_url = None
            if latest_explanation_doc.pdf_path:
                pdf_url = FileStorage.get_file_url(
                    latest_explanation_doc.pdf_path)

            latest_explanation_document_data = {
                "id": latest_explanation_doc.id,
                "latex_code": latest_explanation_doc.latex_code,
                "pdf_url": pdf_url,
                "version": latest_explanation_doc.version,
                "is_confirmed": latest_explanation_doc.is_confirmed,
                "created_at": latest_explanation_doc.created_at,
            }

        response_serializer = ProjectDetailResponseSerializer({
            "id": problem.id,
            "title": problem.title,
            "created_at": problem.created_at,
            "updated_at": problem.updated_at,
            "image_url": image_url,
            "solution_notes": problem.solution_notes or None,
            "latest_latex_document": latest_latex_document_data,
            "latest_explanation_document": latest_explanation_document_data,
        })

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="プロジェクト更新",
        description="プロジェクトの解法メモを更新します",
        request=ProjectUpdateRequestSerializer,
        responses={200: ProjectDetailResponseSerializer},
    )
    def put(self, request, pk):
        """
        プロジェクトの解法メモを更新（PUT: 完全更新）
        """
        return self._update_project(request, pk, partial=False)

    @extend_schema(
        summary="プロジェクト部分更新",
        description="プロジェクトの解法メモを部分的に更新します（送信されたフィールドのみ更新）",
        request=ProjectUpdateRequestSerializer,
        responses={200: ProjectDetailResponseSerializer},
    )
    def patch(self, request, pk):
        """
        プロジェクトの解法メモを更新（PATCH: 部分更新）
        """
        return self._update_project(request, pk, partial=True)

    def _update_project(self, request, pk, partial=False):
        """
        プロジェクト更新の共通処理
        """
        try:
            problem = Problem.objects.select_related(
                'user').get(id=pk, deleted_at__isnull=True)
        except Problem.DoesNotExist:
            return Response(
                {"error": "プロジェクトが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ユーザーが所有しているか確認
        if problem.user != request.user:
            return Response(
                {"error": "このプロジェクトへのアクセス権限がありません"},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = ProjectUpdateRequestSerializer(
            data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)

        if 'solution_notes' in serializer.validated_data:
            problem.solution_notes = serializer.validated_data['solution_notes']
            problem.save()

        image_url = None
        if problem.original_image_path:
            image_url = FileStorage.get_file_url(problem.original_image_path)

        latest_latex_doc = ProblemLatexDocument.objects.select_related('problem').filter(
            problem=problem
        ).order_by('-version').first()

        latest_latex_document_data = None
        if latest_latex_doc:
            pdf_url = None
            if latest_latex_doc.pdf_path:
                pdf_url = FileStorage.get_file_url(latest_latex_doc.pdf_path)

            latest_latex_document_data = {
                "id": latest_latex_doc.id,
                "latex_code": latest_latex_doc.latex_code,
                "pdf_url": pdf_url,
                "version": latest_latex_doc.version,
                "is_confirmed": latest_latex_doc.is_confirmed,
                "created_at": latest_latex_doc.created_at,
            }

        # 最新の解説ドキュメントを取得
        latest_explanation_doc = Explanation.objects.select_related('problem').filter(
            problem=problem
        ).order_by('-version').first()

        latest_explanation_document_data = None
        if latest_explanation_doc:
            pdf_url = None
            if latest_explanation_doc.pdf_path:
                pdf_url = FileStorage.get_file_url(
                    latest_explanation_doc.pdf_path)

            latest_explanation_document_data = {
                "id": latest_explanation_doc.id,
                "latex_code": latest_explanation_doc.latex_code,
                "pdf_url": pdf_url,
                "version": latest_explanation_doc.version,
                "is_confirmed": latest_explanation_doc.is_confirmed,
                "created_at": latest_explanation_doc.created_at,
            }

        response_serializer = ProjectDetailResponseSerializer({
            "id": problem.id,
            "title": problem.title,
            "created_at": problem.created_at,
            "updated_at": problem.updated_at,
            "image_url": image_url,
            "solution_notes": problem.solution_notes or None,
            "latest_latex_document": latest_latex_document_data,
            "latest_explanation_document": latest_explanation_document_data,
        })

        self.log_info(f"プロジェクト更新成功: {problem.id}")
        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )

    @extend_schema(
        summary="プロジェクト削除",
        description="プロジェクトを削除します（ゴミ箱に移動）",
        responses={200: ProjectResponseSerializer},
    )
    def delete(self, request, pk):
        """
        プロジェクトを削除（ソフトデリート）
        """
        try:
            problem = Problem.objects.select_related(
                'user').get(id=pk, deleted_at__isnull=True)
        except Problem.DoesNotExist:
            return Response(
                {"error": "プロジェクトが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ユーザーが所有しているか確認
        if problem.user != request.user:
            return Response(
                {"error": "このプロジェクトへのアクセス権限がありません"},
                status=status.HTTP_403_FORBIDDEN,
            )

        problem.deleted_at = timezone.now()
        problem.save()

        self.log_info(f"プロジェクト削除成功: {problem.id}")

        response_serializer = ProjectResponseSerializer({
            "id": problem.id,
            "title": problem.title,
            "created_at": problem.created_at,
            "updated_at": problem.updated_at,
        })

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )


class ProjectRestoreView(BaseAPIView):
    """
    プロジェクト復元用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="プロジェクト復元",
        description="ゴミ箱からプロジェクトを復元します",
        responses={200: ProjectResponseSerializer},
    )
    def post(self, request, pk):
        """
        プロジェクトを復元
        """
        try:
            problem = Problem.objects.select_related(
                'user').get(id=pk, deleted_at__isnull=False)
        except Problem.DoesNotExist:
            return Response(
                {"error": "プロジェクトが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ユーザーが所有しているか確認
        if problem.user != request.user:
            return Response(
                {"error": "このプロジェクトへのアクセス権限がありません"},
                status=status.HTTP_403_FORBIDDEN,
            )

        problem.deleted_at = None
        problem.save()

        self.log_info(f"プロジェクト復元成功: {problem.id}")

        response_serializer = ProjectResponseSerializer({
            "id": problem.id,
            "title": problem.title,
            "created_at": problem.created_at,
            "updated_at": problem.updated_at,
        })

        return Response(
            response_serializer.data,
            status=status.HTTP_200_OK
        )


class ProjectTrashListView(BaseAPIView):
    """
    ゴミ箱内プロジェクト一覧取得用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="ゴミ箱内プロジェクト一覧取得",
        description="認証済みユーザーの削除済みプロジェクト一覧を取得します",
        responses={200: ProjectListResponseSerializer(many=True)},
    )
    def get(self, request):
        """
        ゴミ箱内のプロジェクト一覧を取得
        """
        problems = Problem.objects.filter(
            user=request.user,
            deleted_at__isnull=False
        ).order_by('-deleted_at')

        serializer = ProjectListResponseSerializer(
            [
                {
                    "id": problem.id,
                    "title": problem.title,
                    "created_at": problem.created_at,
                    "updated_at": problem.updated_at,
                }
                for problem in problems
            ],
            many=True
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class ProjectPermanentDeleteView(BaseAPIView):
    """
    プロジェクト完全削除用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="プロジェクト完全削除",
        description="ゴミ箱からプロジェクトを完全に削除します（取り消し不可）",
        responses={204: None},
    )
    def delete(self, request, pk):
        """
        プロジェクトを完全削除
        """
        try:
            problem = Problem.objects.select_related(
                'user').get(id=pk, deleted_at__isnull=False)
        except Problem.DoesNotExist:
            return Response(
                {"error": "プロジェクトが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        # ユーザーが所有しているか確認
        if problem.user != request.user:
            return Response(
                {"error": "このプロジェクトへのアクセス権限がありません"},
                status=status.HTTP_403_FORBIDDEN,
            )

        project_id = problem.id
        problem.delete()

        self.log_info(f"プロジェクト完全削除成功: {project_id}")

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )
