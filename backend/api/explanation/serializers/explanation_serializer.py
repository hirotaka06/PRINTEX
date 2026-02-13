from rest_framework import serializers


class ExplanationRequestSerializer(serializers.Serializer):
    problem_id = serializers.UUIDField(help_text="プロジェクトID")


class ExplanationResponseSerializer(serializers.Serializer):
    explanation_id = serializers.UUIDField(help_text="解説ID")
    latex_code = serializers.CharField(help_text="解説のLaTeXコード")
    pdf_url = serializers.URLField(help_text="解説PDFのURL")
    version = serializers.IntegerField(help_text="バージョン番号")
    created_at = serializers.DateTimeField(help_text="作成日時")

    # 後方互換性のため、latex_document_idも残す
    latex_document_id = serializers.UUIDField(
        help_text="解説ID（後方互換性のため）", source='explanation_id')
