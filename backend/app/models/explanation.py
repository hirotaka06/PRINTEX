import uuid
from django.db import models
from app.models.problem import Problem
from app.models.problem_latex_document import ProblemLatexDocument
from app.utils.file_storage import FileStorage


class Explanation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name="explanations",
        help_text="紐づく問題（プロジェクト）"
    )
    # 解説生成時に使用した問題LaTeXドキュメントへの参照
    source_problem_latex = models.ForeignKey(
        ProblemLatexDocument,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="generated_explanations",
        help_text="解説生成時に使用した問題LaTeXドキュメント"
    )
    latex_code = models.TextField(
        help_text="解説のLaTeXコード（テンプレート適用済み）"
    )
    pdf_path = models.CharField(
        max_length=500,
        blank=True,
        help_text="解説PDFのパス（存在しない場合は空文字列）"
    )
    version = models.IntegerField(default=1, help_text="解説のバージョン番号")
    is_confirmed = models.BooleanField(
        default=False,
        help_text="ユーザーが確認済みかどうか"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "explanations"
        ordering = ["problem", "-version"]
        unique_together = [["problem", "version"]]
        indexes = [
            models.Index(fields=["problem", "-version"]),
            models.Index(fields=["problem", "is_confirmed", "-version"]),
            models.Index(fields=["source_problem_latex"]),
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
        return f"Explanation {self.id} for Problem {self.problem.id} (v{self.version})"
