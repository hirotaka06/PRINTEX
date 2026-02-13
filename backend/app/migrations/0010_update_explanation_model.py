# Generated manually

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0009_create_problem_latex_document'),
    ]

    operations = [
        # Explanationモデルを再作成（0006で削除されているため）
        migrations.CreateModel(
            name='Explanation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('latex_code', models.TextField(help_text='解説のLaTeXコード（テンプレート適用済み）')),
                ('pdf_path', models.CharField(blank=True, help_text='解説PDFのパス（存在しない場合は空文字列）', max_length=500)),
                ('version', models.IntegerField(default=1, help_text='解説のバージョン番号')),
                ('is_confirmed', models.BooleanField(default=False, help_text='ユーザーが確認済みかどうか')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('problem', models.ForeignKey(help_text='紐づく問題（プロジェクト）', on_delete=django.db.models.deletion.CASCADE, related_name='explanations', to='app.problem')),
                ('source_problem_latex', models.ForeignKey(blank=True, help_text='解説生成時に使用した問題LaTeXドキュメント', null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='generated_explanations', to='app.problemlatexdocument')),
            ],
            options={
                'db_table': 'explanations',
                'ordering': ['problem', '-version'],
            },
        ),
        # インデックスの追加
        migrations.AddIndex(
            model_name='explanation',
            index=models.Index(fields=['problem', '-version'], name='explanation_problem_version_idx'),
        ),
        migrations.AddIndex(
            model_name='explanation',
            index=models.Index(fields=['problem', 'is_confirmed', '-version'], name='explanation_problem_confirmed_idx'),
        ),
        migrations.AddIndex(
            model_name='explanation',
            index=models.Index(fields=['source_problem_latex'], name='explanation_source_latex_idx'),
        ),
        # unique_togetherの追加
        migrations.AlterUniqueTogether(
            name='explanation',
            unique_together={('problem', 'version')},
        ),
    ]
