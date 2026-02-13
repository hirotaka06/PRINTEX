from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes
from api.shared.views.base_api_view import BaseAPIView
from api.ocr.serializers.ocr_serializer import (
    OCRRequestSerializer,
    OCRResponseSerializer,
)
from api.ocr.services.ocr_service import OCRService
from app.utils.file_storage import FileStorage
from app.models.problem import Problem
from app.models.problem_latex_document import ProblemLatexDocument
from api.latex.services.pdf_service import PDFService
from api.template.services.template_service import (
    get_user_template,
    get_system_default_template,
    wrap_latex_with_template,
)


class OCRView(BaseAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="画像からLaTeXコードを生成",
        description="数学問題の画像をアップロードして、OCRとAI校正によりLaTeXコードを生成します",
        request={
            'multipart/form-data': {
                'type': 'object',
                'properties': {
                    'image': {
                        'type': 'string',
                        'format': 'binary',
                    },
                    'problem_id': {
                        'type': 'string',
                        'format': 'uuid',
                    },
                },
                'required': ['image', 'problem_id'],
            }
        },
        responses={201: OCRResponseSerializer},
    )
    def post(self, request):
        try:
            serializer = OCRRequestSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            image_file = serializer.validated_data["image"]
            problem_id = serializer.validated_data["problem_id"]
            user = request.user

            try:
                problem = Problem.objects.select_related(
                    'user').get(id=problem_id)
            except Problem.DoesNotExist:
                return Response(
                    {"error": "プロジェクトが見つかりません"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            if problem.user != user:
                return Response(
                    {"error": "このプロジェクトへのアクセス権限がありません"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            image_path = FileStorage.save_image(
                image_file, folder_name="images", prefix=f"user_{user.id}"
            )

            problem.original_image_path = image_path
            problem.save()

            ocr_service = OCRService()
            raw_latex_code = ocr_service.process_image_to_latex(image_path)

            user_template = get_user_template(user)
            if user_template:
                template = user_template
            else:
                template = get_system_default_template()

            wrapped_latex_code = wrap_latex_with_template(
                raw_latex_code, template)

            from django.db.models import Max
            max_version = ProblemLatexDocument.objects.filter(
                problem=problem
            ).aggregate(max_version=Max('version'))['max_version'] or 0
            new_version = max_version + 1

            latex_doc = ProblemLatexDocument.objects.create(
                problem=problem,
                latex_code=wrapped_latex_code,
                version=new_version
            )

            pdf_service = PDFService()
            pdf_path = pdf_service.latex_to_pdf(
                wrapped_latex_code,
                output_filename=f"problem_{problem.id}",
                use_template=False
            )
            pdf_url = FileStorage.get_file_url(pdf_path)

            latex_doc.pdf_path = pdf_path
            latex_doc.save()

            response_serializer = OCRResponseSerializer(
                {
                    "problem_id": problem.id,
                    "latex_document_id": latex_doc.id,  # 後方互換性のため
                    "latex_code": wrapped_latex_code,  # ラップされたLaTeXコードを返す
                    "pdf_url": pdf_url,
                    "created_at": problem.created_at,
                }
            )

            self.log_info(f"OCR成功: Problem {problem.id}")
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            self.log_error(f"OCRエラー: {str(e)}")
            return Response(
                {"error": f"OCR処理中にエラーが発生しました: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
