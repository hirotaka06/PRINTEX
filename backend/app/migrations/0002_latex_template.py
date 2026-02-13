# Generated manually for LaTeX template feature

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


def create_system_default_template(apps, schema_editor):
    """
    システムデフォルトテンプレートを作成
    """
    LatexTemplate = apps.get_model("app", "LatexTemplate")
    LatexTemplate.objects.create(
        user=None,
        name="システムデフォルト",
        content="""\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

{children}

\\end{document}""",
        is_default=False
    )


def reverse_create_system_default_template(apps, schema_editor):
    """
    システムデフォルトテンプレートを削除
    """
    LatexTemplate = apps.get_model("app", "LatexTemplate")
    LatexTemplate.objects.filter(user=None, name="システムデフォルト").delete()


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="LatexTemplate",
            fields=[
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "name",
                    models.CharField(help_text="テンプレート名", max_length=200),
                ),
                (
                    "content",
                    models.TextField(
                        help_text="テンプレート内容（{children}プレースホルダーを含む）"
                    ),
                ),
                (
                    "is_default",
                    models.BooleanField(
                        default=False,
                        help_text="ユーザーのデフォルトテンプレートかどうか",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        help_text="ユーザー（nullの場合はシステムデフォルトテンプレート）",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="latex_templates",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "db_table": "latex_templates",
                "ordering": ["user", "-is_default", "-created_at"],
            },
        ),
        migrations.AddIndex(
            model_name="latextemplate",
            index=models.Index(
                fields=["user", "-is_default"], name="app_latext_user_id_2a3f4e_idx"
            ),
        ),
        migrations.AddConstraint(
            model_name="latextemplate",
            constraint=models.UniqueConstraint(
                condition=models.Q(("is_default", True)),
                fields=("user", "is_default"),
                name="unique_user_default_template",
            ),
        ),
        migrations.RunPython(
            create_system_default_template, reverse_create_system_default_template
        ),
    ]
