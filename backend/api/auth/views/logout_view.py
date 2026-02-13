from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from django.contrib.auth import logout
from api.shared.views.base_api_view import BaseAPIView
from api.auth.serializers.logout_serializer import LogoutResponseSerializer


class LogoutView(BaseAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="ログアウト",
        description="ログアウトしてセッションを終了します",
        responses={200: LogoutResponseSerializer},
    )
    def post(self, request, *args, **kwargs):
        logout(request)
        request.session.flush()

        self.log_info(
            f"ログアウト成功: {request.user.username if request.user.is_authenticated else 'anonymous'}")

        response = Response(
            {
                "success": True,
                "message": "Logged out successfully.",
            },
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("sessionid")

        return response
