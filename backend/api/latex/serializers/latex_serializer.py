from rest_framework import serializers


class ProblemLatexRenderRequestSerializer(serializers.Serializer):
    problem_id = serializers.UUIDField(help_text="プロジェクトID（必須）")
    problem_latex_document_id = serializers.UUIDField(
        required=False, allow_null=True, help_text="問題LaTeXドキュメントID（存在する場合、バージョン管理用）"
    )
    latex_code = serializers.CharField(help_text="編集されたLaTeXコード")


class ExplanationLatexRenderRequestSerializer(serializers.Serializer):
    problem_id = serializers.UUIDField(help_text="プロジェクトID（必須）")
    explanation_id = serializers.UUIDField(
        required=False, allow_null=True, help_text="解説ID（存在する場合、バージョン管理用）"
    )
    latex_code = serializers.CharField(help_text="編集されたLaTeXコード")


# 後方互換性のため、旧シリアライザーも残す
class LatexRenderRequestSerializer(serializers.Serializer):
    problem_id = serializers.UUIDField(help_text="プロジェクトID（必須）")
    document_type = serializers.ChoiceField(
        choices=['problem', 'explanation'],
        help_text="ドキュメントタイプ（問題または解説）"
    )
    latex_document_id = serializers.UUIDField(
        required=False, allow_null=True, help_text="LaTeXドキュメントID（存在する場合、バージョン管理用）"
    )
    latex_code = serializers.CharField(help_text="編集されたLaTeXコード")


class ProblemLatexRenderResponseSerializer(serializers.Serializer):
    problem_latex_document_id = serializers.UUIDField(help_text="問題LaTeXドキュメントID")
    pdf_url = serializers.URLField(help_text="生成されたPDFのURL")
    version = serializers.IntegerField(help_text="バージョン番号")
    updated_at = serializers.DateTimeField(help_text="更新日時")


class ExplanationLatexRenderResponseSerializer(serializers.Serializer):
    explanation_id = serializers.UUIDField(help_text="解説ID")
    pdf_url = serializers.URLField(help_text="生成されたPDFのURL")
    version = serializers.IntegerField(help_text="バージョン番号")
    updated_at = serializers.DateTimeField(help_text="更新日時")


# 後方互換性のため、旧シリアライザーも残す
class LatexRenderResponseSerializer(serializers.Serializer):
    latex_document_id = serializers.UUIDField(help_text="LaTeXドキュメントID")
    pdf_url = serializers.URLField(help_text="生成されたPDFのURL")
    version = serializers.IntegerField(help_text="バージョン番号")
    updated_at = serializers.DateTimeField(help_text="更新日時")
