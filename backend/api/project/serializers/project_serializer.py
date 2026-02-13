from rest_framework import serializers
from app.models.problem import Problem


class ProjectCreateRequestSerializer(serializers.Serializer):
    """
    プロジェクト作成用リクエストシリアライザー
    """
    title = serializers.CharField(
        max_length=200,
        help_text="プロジェクトタイトル"
    )

    def validate_title(self, value):
        """
        タイトルが空でないことを確認
        """
        if not value or not value.strip():
            raise serializers.ValidationError("プロジェクトタイトルは必須です")
        return value.strip()


class ProjectUpdateRequestSerializer(serializers.Serializer):
    """
    プロジェクト更新用リクエストシリアライザー
    """
    solution_notes = serializers.CharField(
        allow_blank=True,
        required=False,
        help_text="解法のメモ（解説生成時に参考にされます）"
    )


class ProjectResponseSerializer(serializers.Serializer):
    """
    プロジェクトレスポンス用シリアライザー
    """
    id = serializers.UUIDField(help_text="プロジェクトID")
    title = serializers.CharField(help_text="プロジェクトタイトル")
    created_at = serializers.DateTimeField(help_text="作成日時")
    updated_at = serializers.DateTimeField(help_text="更新日時")


class ProjectListResponseSerializer(serializers.Serializer):
    """
    プロジェクト一覧用レスポンスシリアライザー（軽量版）
    """
    id = serializers.UUIDField(help_text="プロジェクトID")
    title = serializers.CharField(help_text="プロジェクトタイトル")
    created_at = serializers.DateTimeField(help_text="作成日時")
    updated_at = serializers.DateTimeField(help_text="更新日時")


class ProblemLatexDocumentSerializer(serializers.Serializer):
    """
    問題用LaTeXドキュメント情報用シリアライザー
    """
    id = serializers.UUIDField(help_text="問題LaTeXドキュメントID")
    latex_code = serializers.CharField(help_text="LaTeXコード")
    pdf_url = serializers.URLField(allow_null=True, help_text="PDFのURL")
    version = serializers.IntegerField(help_text="バージョン番号")
    is_confirmed = serializers.BooleanField(help_text="確認済みかどうか")
    created_at = serializers.DateTimeField(help_text="作成日時")


class ExplanationDocumentSerializer(serializers.Serializer):
    """
    解説ドキュメント情報用シリアライザー
    """
    id = serializers.UUIDField(help_text="解説ID")
    latex_code = serializers.CharField(help_text="LaTeXコード")
    pdf_url = serializers.URLField(allow_null=True, help_text="PDFのURL")
    version = serializers.IntegerField(help_text="バージョン番号")
    is_confirmed = serializers.BooleanField(help_text="確認済みかどうか")
    created_at = serializers.DateTimeField(help_text="作成日時")


# 後方互換性のため、LatexDocumentSerializerも残す
LatexDocumentSerializer = ProblemLatexDocumentSerializer


class ProjectDetailResponseSerializer(serializers.Serializer):
    """
    プロジェクト詳細用レスポンスシリアライザー
    """
    id = serializers.UUIDField(help_text="プロジェクトID")
    title = serializers.CharField(help_text="プロジェクトタイトル")
    created_at = serializers.DateTimeField(help_text="作成日時")
    updated_at = serializers.DateTimeField(help_text="更新日時")
    image_url = serializers.URLField(allow_null=True, help_text="アップロード画像のURL")
    solution_notes = serializers.CharField(allow_null=True, allow_blank=True, help_text="解法のメモ")
    latest_latex_document = ProblemLatexDocumentSerializer(allow_null=True, help_text="最新の問題LaTeXドキュメント")
    latest_explanation_document = ExplanationDocumentSerializer(allow_null=True, help_text="最新の解説ドキュメント")
