from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from api.shared.views.base_api_view import BaseAPIView
from api.explanation.serializers.explanation_serializer import (
    ExplanationRequestSerializer,
    ExplanationResponseSerializer,
)
from app.models.problem import Problem
from app.models.problem_latex_document import ProblemLatexDocument
from app.models.explanation import Explanation
from app.utils.file_storage import FileStorage
from api.explanation.services.explanation_service import (
    ExplanationService,
)
from api.template.services.template_service import (
    get_user_template,
    get_system_default_template,
    wrap_latex_with_template,
)


class ExplanationView(BaseAPIView):
    """
    解説生成用ビュー
    """
    permission_classes = [IsAuthenticated]
    @extend_schema(
        summary="解説を生成",
        description="確認済みのLaTeXコードから問題の解説をAIで生成します",
        request=ExplanationRequestSerializer,
        responses={200: ExplanationResponseSerializer},
    )
    def post(self, request):
        try:
            serializer = ExplanationRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            problem_id = serializer.validated_data["problem_id"]

            try:
                # select_relatedでuserを事前に取得（N+1問題を防止）
                problem = Problem.objects.select_related('user').get(id=problem_id)
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

            problem_doc = ProblemLatexDocument.objects.select_related('problem').filter(
                problem=problem,
                is_confirmed=True
            ).order_by('-version').first()

            if not problem_doc:
                problem_doc = ProblemLatexDocument.objects.select_related('problem').filter(
                    problem=problem
                ).order_by('-version').first()

            if not problem_doc:
                return Response(
                    {"error": "問題のLaTeXドキュメントが見つかりません"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            explanation_service = ExplanationService()
            solution_notes = problem.solution_notes if problem.solution_notes else None
            raw_explanation_latex = explanation_service.generate_explanation(
                problem_doc.latex_code,
                solution_notes=solution_notes
            )

            user = request.user
            user_template = get_user_template(user)
            if user_template:
                template = user_template
            else:
                template = get_system_default_template()

            wrapped_explanation_latex = wrap_latex_with_template(raw_explanation_latex, template)

            from django.db.models import Max
            max_version = Explanation.objects.filter(
                problem=problem
            ).aggregate(max_version=Max('version'))['max_version'] or 0
            new_version = max_version + 1

            from api.latex.services.pdf_service import PDFService
            pdf_service = PDFService()
            explanation_pdf_path = pdf_service.latex_to_pdf(
                wrapped_explanation_latex,
                output_filename=f"explanation_{problem.id}",
                use_template=False
            )

            explanation_doc = Explanation.objects.create(
                problem=problem,
                source_problem_latex=problem_doc,
                latex_code=wrapped_explanation_latex,
                pdf_path=explanation_pdf_path,
                version=new_version,
                is_confirmed=False,
            )

            explanation_pdf_url = FileStorage.get_file_url(
                explanation_pdf_path)

            response_serializer = ExplanationResponseSerializer(
                {
                    "explanation_id": explanation_doc.id,
                    "latex_document_id": explanation_doc.id,  # 後方互換性のため
                    "latex_code": wrapped_explanation_latex,  # ラップされたLaTeXコードを返す
                    "pdf_url": explanation_pdf_url,
                    "version": new_version,
                    "created_at": explanation_doc.created_at,
                }
            )

            self.log_info(f"解説生成成功: Explanation {explanation_doc.id}")
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            self.log_error(f"解説生成エラー: {str(e)}")
            return Response(
                {"error": f"解説生成中にエラーが発生しました: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
