from rest_framework import serializers


class LogoutResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField(help_text="ログアウト成功フラグ")
    message = serializers.CharField(help_text="ログアウトメッセージ")
