import uuid
from django.db import models
from app.models.problem import Problem


class DocumentType(models.TextChoices):
    PROBLEM = 'problem', '問題'
    EXPLANATION = 'explanation', '解説'


class LatexDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(
        Problem, on_delete=models.CASCADE, related_name="latex_documents"
    )
    document_type = models.CharField(
        max_length=20,
        choices=DocumentType.choices,
        default=DocumentType.PROBLEM,
        help_text="ドキュメントタイプ（問題または解説）"
    )
    latex_code = models.TextField(help_text="LaTeXコード")
    pdf_path = models.CharField(
        max_length=500, blank=True, help_text="生成PDFのパス（存在しない場合は空文字列）"
    )
    version = models.IntegerField(default=1, help_text="バージョン番号")
    is_confirmed = models.BooleanField(
        default=False, help_text="ユーザーが確認済みかどうか"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "latex_documents"
        ordering = ["problem", "document_type", "-version"]
        indexes = [
            models.Index(fields=["problem", "document_type", "-version"]),
        ]
        unique_together = [["problem", "document_type", "version"]]

    def __str__(self):
        return f"LatexDocument {self.id} (Problem {self.problem.id}, {self.document_type}, v{self.version})"
