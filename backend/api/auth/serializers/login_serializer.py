from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(
        allow_blank=False,
        help_text="ユーザー名"
    )
    password = serializers.CharField(
        allow_blank=False,
        help_text="パスワード"
    )
