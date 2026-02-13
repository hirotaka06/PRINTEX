from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.db.models import Max
from api.shared.views.base_api_view import BaseAPIView
from api.latex.serializers.latex_serializer import (
    LatexRenderRequestSerializer,
    LatexRenderResponseSerializer,
)
from app.models.problem_latex_document import ProblemLatexDocument
from app.models.explanation import Explanation
from app.models.problem import Problem
from app.utils.file_storage import FileStorage
from api.latex.services.pdf_service import PDFService


class LatexRenderView(BaseAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="LaTeXコードをPDFに変換",
        description="編集されたLaTeXコードをPDFに変換します",
        request=LatexRenderRequestSerializer,
        responses={200: LatexRenderResponseSerializer},
    )
    def post(self, request):
        try:
            serializer = LatexRenderRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            problem_id = serializer.validated_data["problem_id"]
            document_type_str = serializer.validated_data["document_type"]
            latex_document_id = serializer.validated_data.get(
                "latex_document_id")
            latex_code = serializer.validated_data["latex_code"]

            try:
                problem = Problem.objects.select_related(
                    'user').get(id=problem_id)
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

            if document_type_str == 'problem':
                if latex_document_id:
                    try:
                        existing_doc = ProblemLatexDocument.objects.select_related(
                            'problem').get(id=latex_document_id)
                        if existing_doc.problem != problem:
                            return Response(
                                {"error": "問題LaTeXドキュメントがプロジェクトに紐づいていません"},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    except ProblemLatexDocument.DoesNotExist:
                        return Response(
                            {"error": "問題LaTeXドキュメントが見つかりません"},
                            status=status.HTTP_404_NOT_FOUND,
                        )

                max_version = ProblemLatexDocument.objects.filter(
                    problem=problem
                ).aggregate(max_version=Max('version'))['max_version'] or 0
                new_version = max_version + 1

                new_doc = ProblemLatexDocument.objects.create(
                    problem=problem,
                    latex_code=latex_code,
                    version=new_version,
                )
                doc_id = new_doc.id
                doc_type_name = "ProblemLatexDocument"
            else:
                if latex_document_id:
                    try:
                        existing_doc = Explanation.objects.select_related(
                            'problem').get(id=latex_document_id)
                        if existing_doc.problem != problem:
                            return Response(
                                {"error": "解説がプロジェクトに紐づいていません"},
                                status=status.HTTP_400_BAD_REQUEST,
                            )
                    except Explanation.DoesNotExist:
                        return Response(
                            {"error": "解説が見つかりません"},
                            status=status.HTTP_404_NOT_FOUND,
                        )

                max_version = Explanation.objects.filter(
                    problem=problem
                ).aggregate(max_version=Max('version'))['max_version'] or 0
                new_version = max_version + 1

                source_problem_latex = ProblemLatexDocument.objects.filter(
                    problem=problem,
                    is_confirmed=True
                ).order_by('-version').first()

                if not source_problem_latex:
                    source_problem_latex = ProblemLatexDocument.objects.filter(
                        problem=problem
                    ).order_by('-version').first()

                new_doc = Explanation.objects.create(
                    problem=problem,
                    source_problem_latex=source_problem_latex,
                    latex_code=latex_code,
                    version=new_version,
                )
                doc_id = new_doc.id
                doc_type_name = "Explanation"

            pdf_service = PDFService()
            pdf_path = pdf_service.latex_to_pdf(
                latex_code,
                output_filename=f"latex_{new_doc.id}",
                use_template=False
            )
            pdf_url = FileStorage.get_file_url(pdf_path)

            new_doc.pdf_path = pdf_path
            new_doc.save()

            response_serializer = LatexRenderResponseSerializer(
                {
                    "latex_document_id": doc_id,  # 後方互換性のため
                    "pdf_url": pdf_url,
                    "version": new_version,
                    "updated_at": new_doc.updated_at,
                }
            )

            self.log_info(f"LaTeXレンダリング成功: {doc_type_name} {doc_id}")
            return Response(response_serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            self.log_error(f"LaTeXレンダリングエラー: {str(e)}")
            return Response(
                {"error": f"PDF生成中にエラーが発生しました: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
