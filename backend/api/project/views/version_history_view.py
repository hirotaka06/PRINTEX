"""
バージョン履歴と確認済みフラグ管理用ビュー
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from api.shared.views.base_api_view import BaseAPIView
from app.models.problem import Problem
from app.models.problem_latex_document import ProblemLatexDocument
from app.models.explanation import Explanation
from app.utils.file_storage import FileStorage
from api.project.serializers.project_serializer import (
    ProblemLatexDocumentSerializer,
    ExplanationDocumentSerializer,
)


class ProblemLatexHistoryView(BaseAPIView):
    """
    問題LaTeXドキュメントのバージョン履歴取得用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="問題LaTeXのバージョン履歴取得",
        description="プロジェクトの問題LaTeXドキュメントのバージョン履歴を取得します",
        responses={200: ProblemLatexDocumentSerializer(many=True)},
    )
    def get(self, request, pk):
        """
        問題LaTeXドキュメントのバージョン履歴を取得
        """
        try:
            problem = Problem.objects.select_related('user').get(id=pk, deleted_at__isnull=True)
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

        latex_docs = ProblemLatexDocument.objects.filter(
            problem=problem
        ).order_by('-version')

        history_data = []
        for doc in latex_docs:
            pdf_url = None
            if doc.pdf_path:
                pdf_url = FileStorage.get_file_url(doc.pdf_path)

            history_data.append({
                "id": doc.id,
                "latex_code": doc.latex_code,
                "pdf_url": pdf_url,
                "version": doc.version,
                "is_confirmed": doc.is_confirmed,
                "created_at": doc.created_at,
            })

        serializer = ProblemLatexDocumentSerializer(history_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExplanationHistoryView(BaseAPIView):
    """
    解説のバージョン履歴取得用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="解説のバージョン履歴取得",
        description="プロジェクトの解説のバージョン履歴を取得します",
        responses={200: ExplanationDocumentSerializer(many=True)},
    )
    def get(self, request, pk):
        """
        解説のバージョン履歴を取得
        """
        try:
            problem = Problem.objects.select_related('user').get(id=pk, deleted_at__isnull=True)
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

        explanations = Explanation.objects.filter(
            problem=problem
        ).order_by('-version')

        history_data = []
        for exp in explanations:
            pdf_url = None
            if exp.pdf_path:
                pdf_url = FileStorage.get_file_url(exp.pdf_path)

            history_data.append({
                "id": exp.id,
                "latex_code": exp.latex_code,
                "pdf_url": pdf_url,
                "version": exp.version,
                "is_confirmed": exp.is_confirmed,
                "created_at": exp.created_at,
            })

        serializer = ExplanationDocumentSerializer(history_data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProblemLatexConfirmView(BaseAPIView):
    """
    問題LaTeXドキュメントを確認済みにするビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="問題LaTeXを確認済みにする",
        description="指定したバージョンの問題LaTeXドキュメントを確認済みにします",
        responses={200: ProblemLatexDocumentSerializer},
    )
    def post(self, request, pk, version):
        """
        問題LaTeXドキュメントを確認済みにする
        """
        try:
            problem = Problem.objects.select_related('user').get(id=pk, deleted_at__isnull=True)
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

        try:
            latex_doc = ProblemLatexDocument.objects.get(
                problem=problem,
                version=version
            )
        except ProblemLatexDocument.DoesNotExist:
            return Response(
                {"error": "指定したバージョンの問題LaTeXドキュメントが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        latex_doc.is_confirmed = True
        latex_doc.save()

        pdf_url = None
        if latex_doc.pdf_path:
            pdf_url = FileStorage.get_file_url(latex_doc.pdf_path)

        serializer = ProblemLatexDocumentSerializer({
            "id": latex_doc.id,
            "latex_code": latex_doc.latex_code,
            "pdf_url": pdf_url,
            "version": latex_doc.version,
            "is_confirmed": latex_doc.is_confirmed,
            "created_at": latex_doc.created_at,
        })

        self.log_info(f"問題LaTeX確認済み設定成功: ProblemLatexDocument {latex_doc.id}")
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExplanationConfirmView(BaseAPIView):
    """
    解説を確認済みにするビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="解説を確認済みにする",
        description="指定したバージョンの解説を確認済みにします",
        responses={200: ExplanationDocumentSerializer},
    )
    def post(self, request, pk, version):
        """
        解説を確認済みにする
        """
        try:
            problem = Problem.objects.select_related('user').get(id=pk, deleted_at__isnull=True)
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

        try:
            explanation = Explanation.objects.get(
                problem=problem,
                version=version
            )
        except Explanation.DoesNotExist:
            return Response(
                {"error": "指定したバージョンの解説が見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        explanation.is_confirmed = True
        explanation.save()

        pdf_url = None
        if explanation.pdf_path:
            pdf_url = FileStorage.get_file_url(explanation.pdf_path)

        serializer = ExplanationDocumentSerializer({
            "id": explanation.id,
            "latex_code": explanation.latex_code,
            "pdf_url": pdf_url,
            "version": explanation.version,
            "is_confirmed": explanation.is_confirmed,
            "created_at": explanation.created_at,
        })

        self.log_info(f"解説確認済み設定成功: Explanation {explanation.id}")
        return Response(serializer.data, status=status.HTTP_200_OK)
