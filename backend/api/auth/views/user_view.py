from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from api.shared.views.base_api_view import BaseAPIView


class CurrentUserView(BaseAPIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="現在のユーザー情報を取得",
        description="認証されているユーザーの情報を取得します",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "id": {"type": "integer"},
                    "username": {"type": "string"},
                    "email": {"type": "string"},
                }
            },
            401: {
                "type": "object",
                "properties": {
                    "error": {"type": "string"},
                }
            }
        },
    )
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response(
                {
                    "id": request.user.id,
                    "username": request.user.username,
                    "email": request.user.email if hasattr(request.user, 'email') else None,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "error": "認証されていません",
            },
            status=status.HTTP_401_UNAUTHORIZED,
        )
