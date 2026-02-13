import uuid
from django.db import models
from django.contrib.auth.models import User


class Problem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="problems")
    title = models.CharField(
        max_length=200, blank=True, help_text="プロジェクトタイトル"
    )
    original_image_path = models.CharField(
        max_length=500, blank=True, help_text="元画像のパス（画像なしの場合は空文字列）"
    )
    solution_notes = models.TextField(
        blank=True, help_text="解法のメモ（解説生成時に参考にされます）"
    )
    deleted_at = models.DateTimeField(
        null=True, blank=True, help_text="削除日時（ソフトデリート用）"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "problems"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
        ]

    def __str__(self):
        return f"Problem {self.id} by {self.user.username}"
