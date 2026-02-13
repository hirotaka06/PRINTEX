# Generated manually

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0008_add_deleted_at_to_problem'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProblemLatexDocument',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('latex_code', models.TextField(help_text='LaTeXコード')),
                ('pdf_path', models.CharField(blank=True, help_text='生成PDFのパス（存在しない場合は空文字列）', max_length=500)),
                ('version', models.IntegerField(default=1, help_text='バージョン番号')),
                ('is_confirmed', models.BooleanField(default=False, help_text='ユーザーが確認済みかどうか')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('problem', models.ForeignKey(help_text='紐づく問題（プロジェクト）', on_delete=django.db.models.deletion.CASCADE, related_name='problem_latex_documents', to='app.problem')),
            ],
            options={
                'db_table': 'problem_latex_documents',
                'ordering': ['problem', '-version'],
            },
        ),
        migrations.AddIndex(
            model_name='problemlatexdocument',
            index=models.Index(fields=['problem', '-version'], name='problem_lat_problem_idx'),
        ),
        migrations.AddIndex(
            model_name='problemlatexdocument',
            index=models.Index(fields=['problem', 'is_confirmed', '-version'], name='problem_lat_problem_confirmed_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='problemlatexdocument',
            unique_together={('problem', 'version')},
        ),
    ]
