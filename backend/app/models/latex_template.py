import uuid
from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class LatexTemplate(models.Model):
    """
    LaTeXテンプレートのモデル
    ユーザーごとにテンプレートを保存し、OCR結果をラップするために使用
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="latex_templates",
        null=True,
        blank=True,
        help_text="ユーザー（nullの場合はシステムデフォルトテンプレート）"
    )
    name = models.CharField(
        max_length=200,
        help_text="テンプレート名"
    )
    content = models.TextField(
        help_text="テンプレート内容（{children}プレースホルダーを含む）"
    )
    is_default = models.BooleanField(
        default=False,
        help_text="ユーザーのデフォルトテンプレートかどうか"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "latex_templates"
        ordering = ["user", "-is_default", "-created_at"]
        indexes = [
            models.Index(fields=["user", "-is_default"]),
        ]
        # ユーザーごとにis_default=Trueは1つまで
        constraints = [
            models.UniqueConstraint(
                fields=["user", "is_default"],
                condition=models.Q(is_default=True),
                name="unique_user_default_template"
            )
        ]

    def clean(self):
        """
        バリデーション: {children}プレースホルダーが含まれているか確認
        """
        if "{children}" not in self.content:
            raise ValidationError(
                "テンプレートには{children}プレースホルダーが含まれている必要があります"
            )

    def save(self, *args, **kwargs):
        """
        保存前にバリデーションを実行
        """
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        user_str = self.user.username if self.user else "System"
        default_str = " (デフォルト)" if self.is_default else ""
        return f"LatexTemplate {self.name} by {user_str}{default_str}"
