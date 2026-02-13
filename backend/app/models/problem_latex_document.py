import uuid
from django.db import models
from app.models.problem import Problem
from app.utils.file_storage import FileStorage


class ProblemLatexDocument(models.Model):
    """
    問題のLaTeXコードとPDFを管理するモデル
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name="problem_latex_documents",
        help_text="紐づく問題（プロジェクト）"
    )
    latex_code = models.TextField(help_text="LaTeXコード")
    pdf_path = models.CharField(
        max_length=500,
        blank=True,
        help_text="生成PDFのパス（存在しない場合は空文字列）"
    )
    version = models.IntegerField(default=1, help_text="バージョン番号")
    is_confirmed = models.BooleanField(
        default=False,
        help_text="ユーザーが確認済みかどうか"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "problem_latex_documents"
        ordering = ["problem", "-version"]
        unique_together = [["problem", "version"]]
        indexes = [
            models.Index(fields=["problem", "-version"]),
            models.Index(fields=["problem", "is_confirmed", "-version"]),
        ]

    def delete_pdf_file(self):
        """
        PDFファイルを物理的に削除
        """
        if self.pdf_path:
            FileStorage.delete_file(self.pdf_path)
            self.pdf_path = ""
            self.save(update_fields=["pdf_path"])

    def pdf_exists(self):
        """
        PDFファイルが存在するか確認
        """
        if not self.pdf_path:
            return False
        return FileStorage.file_exists(self.pdf_path)

    def __str__(self):
        return f"ProblemLatexDocument {self.id} (Problem {self.problem.id}, v{self.version})"
