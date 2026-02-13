from rest_framework import serializers
from app.models.latex_template import LatexTemplate


class LatexTemplateRequestSerializer(serializers.ModelSerializer):
    """
    LaTeXテンプレートのリクエスト用シリアライザー（作成・更新用）
    id、created_at、updated_atは含まない
    """

    class Meta:
        model = LatexTemplate
        fields = [
            "name",
            "content",
            "is_default",
        ]

    def validate_content(self, value):
        """
        テンプレート内容に{children}プレースホルダーが含まれているか確認
        """
        if "{children}" not in value:
            raise serializers.ValidationError(
                "テンプレートには{children}プレースホルダーが含まれている必要があります"
            )
        return value

    def validate(self, attrs):
        """
        ユーザーごとにis_default=Trueは1つまでという制約を確認
        """
        user = self.context["request"].user
        is_default = attrs.get("is_default", False)
        instance = self.instance

        if is_default:
            # 既存のデフォルトテンプレートをチェック
            existing_default = LatexTemplate.objects.filter(
                user=user, is_default=True
            ).exclude(pk=instance.pk if instance else None)

            if existing_default.exists():
                raise serializers.ValidationError(
                    {
                        "is_default": "ユーザーごとにデフォルトテンプレートは1つまで設定できます"
                    }
                )

        return attrs


class LatexTemplateSerializer(serializers.ModelSerializer):
    """
    LaTeXテンプレートのレスポンス用シリアライザー（CRUD用）
    読み取り専用フィールドを含む
    """

    class Meta:
        model = LatexTemplate
        fields = [
            "id",
            "name",
            "content",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


class LatexTemplateListSerializer(serializers.ModelSerializer):
    """
    LaTeXテンプレートの一覧用シリアライザー（軽量版）
    """

    class Meta:
        model = LatexTemplate
        fields = [
            "id",
            "name",
            "is_default",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]
