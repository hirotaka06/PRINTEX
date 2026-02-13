from rest_framework import serializers


class OCRRequestSerializer(serializers.Serializer):
    image = serializers.ImageField(help_text="数学問題の画像ファイル")
    problem_id = serializers.UUIDField(help_text="プロジェクトID（必須）")


class OCRResponseSerializer(serializers.Serializer):
    problem_id = serializers.UUIDField(help_text="問題ID")
    latex_document_id = serializers.UUIDField(help_text="LaTeXドキュメントID")
    latex_code = serializers.CharField(help_text="生成されたLaTeXコード")
    pdf_url = serializers.URLField(help_text="生成されたPDFのURL")
    created_at = serializers.DateTimeField(help_text="作成日時")
