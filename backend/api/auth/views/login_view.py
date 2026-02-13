from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from django.contrib.auth import authenticate, login
from api.shared.views.base_api_view import BaseAPIView
from api.auth.serializers.login_serializer import LoginSerializer


class LoginView(BaseAPIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="ログイン",
        description="ユーザー名とパスワードでログインします",
        request=LoginSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "success": {"type": "boolean"},
                    "user_id": {"type": "integer"},
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                }
            },
            400: {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                }
            }
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            username=request.data.get("username"),
            password=request.data.get("password"),
        )

        if user:
            # セッションを作成して認証クッキーを付与
            login(request, user)

            self.log_info(f"ログイン成功: {user.username}")

            # ログイン成功時のレスポンス
            return Response(
                {
                    "success": True,
                    "user_id": user.id,
                    "username": user.username,
                    "email": user.email if hasattr(user, 'email') else None,
                },
                status=status.HTTP_200_OK,
            )

        # 認証失敗時のレスポンス
        self.log_warning(f"ログイン失敗: {request.data.get('username')}")
        return Response(
            {
                "success": False,
                "message": "IDまたはパスワードに誤りがあります。",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )
