from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from drf_spectacular.utils import extend_schema
from django.middleware.csrf import get_token
from api.shared.views.base_api_view import BaseAPIView


class CsrfTokenView(BaseAPIView):
    permission_classes = [AllowAny]

    @extend_schema(
        summary="CSRFトークンを取得",
        description="CSRF保護に必要なトークンを取得します",
        responses={
            200: {
                "type": "object",
                "properties": {
                    "token": {"type": "string"},
                }
            }
        },
    )
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return Response(
            {"token": csrf_token},
            status=status.HTTP_200_OK,
        )
