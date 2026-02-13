from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from api.shared.views.base_api_view import BaseAPIView
from api.template.serializers.template_serializer import (
    LatexTemplateSerializer,
    LatexTemplateListSerializer,
    LatexTemplateRequestSerializer,
)
from app.models.latex_template import LatexTemplate


class LatexTemplateListView(BaseAPIView):
    """
    テンプレート一覧取得・作成用ビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="テンプレート一覧取得",
        description="ユーザーのLaTeXテンプレート一覧を取得します",
        responses={200: LatexTemplateListSerializer(many=True)},
    )
    def get(self, request):
        """
        ユーザーのテンプレート一覧を取得
        """
        templates = LatexTemplate.objects.filter(user=request.user).order_by(
            "-is_default", "-created_at"
        )
        serializer = LatexTemplateListSerializer(templates, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="テンプレート作成",
        description="新しいLaTeXテンプレートを作成します",
        request=LatexTemplateRequestSerializer,
        responses={201: LatexTemplateSerializer},
    )
    def post(self, request):
        """
        新しいテンプレートを作成
        """
        serializer = LatexTemplateRequestSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        template = serializer.save(user=request.user)
        response_serializer = LatexTemplateSerializer(template)
        self.log_info(f"テンプレート作成成功: {template.id}")
        return Response(
            response_serializer.data, status=status.HTTP_201_CREATED
        )


class LatexTemplateDetailView(BaseAPIView):
    """
    テンプレート詳細・更新・削除用ビュー
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, user):
        """
        テンプレートを取得（ユーザー所有を確認）
        """
        try:
            template = LatexTemplate.objects.get(pk=pk, user=user)
            return template
        except LatexTemplate.DoesNotExist:
            return None

    @extend_schema(
        summary="テンプレート詳細取得",
        description="指定されたテンプレートの詳細を取得します",
        responses={200: LatexTemplateSerializer, 404: None},
    )
    def get(self, request, pk):
        """
        テンプレート詳細を取得
        """
        template = self.get_object(pk, request.user)
        if template is None:
            return Response(
                {"error": "テンプレートが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LatexTemplateSerializer(template)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="テンプレート更新",
        description="指定されたテンプレートを更新します",
        request=LatexTemplateRequestSerializer,
        responses={200: LatexTemplateSerializer, 404: None},
    )
    def put(self, request, pk):
        """
        テンプレートを更新
        """
        template = self.get_object(pk, request.user)
        if template is None:
            return Response(
                {"error": "テンプレートが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LatexTemplateRequestSerializer(
            template, data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # レスポンス用シリアライザーで返す
        response_serializer = LatexTemplateSerializer(template)
        self.log_info(f"テンプレート更新成功: {template.id}")
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="テンプレート部分更新",
        description="指定されたテンプレートを部分的に更新します（送信されたフィールドのみ更新）",
        request=LatexTemplateRequestSerializer,
        responses={200: LatexTemplateSerializer, 404: None},
    )
    def patch(self, request, pk):
        """
        テンプレートを部分的に更新
        送信されたフィールドのみを更新し、送信されなかったフィールドは既存の値を保持します
        """
        template = self.get_object(pk, request.user)
        if template is None:
            return Response(
                {"error": "テンプレートが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LatexTemplateRequestSerializer(
            template,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        response_serializer = LatexTemplateSerializer(template)
        self.log_info(f"テンプレート部分更新成功: {template.id}")
        return Response(response_serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="テンプレート削除",
        description="指定されたテンプレートを削除します",
        responses={204: None, 404: None},
    )
    def delete(self, request, pk):
        """
        テンプレートを削除
        """
        template = self.get_object(pk, request.user)
        if template is None:
            return Response(
                {"error": "テンプレートが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        template.delete()
        self.log_info(f"テンプレート削除成功: {pk}")
        return Response(status=status.HTTP_204_NO_CONTENT)


class LatexTemplateSetDefaultView(BaseAPIView):
    """
    テンプレートをデフォルトに設定するビュー
    """
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="デフォルトテンプレート設定",
        description="指定されたテンプレートをユーザーのデフォルトテンプレートに設定します",
        responses={200: LatexTemplateSerializer, 404: None},
    )
    def post(self, request, pk):
        """
        テンプレートをデフォルトに設定
        """
        try:
            template = LatexTemplate.objects.get(pk=pk, user=request.user)
        except LatexTemplate.DoesNotExist:
            return Response(
                {"error": "テンプレートが見つかりません"},
                status=status.HTTP_404_NOT_FOUND,
            )

        LatexTemplate.objects.filter(
            user=request.user, is_default=True
        ).exclude(pk=pk).update(is_default=False)

        template.is_default = True
        template.save()

        serializer = LatexTemplateSerializer(template)
        self.log_info(f"デフォルトテンプレート設定成功: {template.id}")
        return Response(serializer.data, status=status.HTTP_200_OK)
