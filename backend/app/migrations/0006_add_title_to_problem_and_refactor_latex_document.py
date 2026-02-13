# Generated manually

from django.db import migrations, models
import django.db.models.deletion


def migrate_explanations_to_latex_documents(apps, schema_editor):
    """
    ExplanationテーブルのデータをLatexDocumentテーブルに移行
    """
    Explanation = apps.get_model("app", "Explanation")
    LatexDocument = apps.get_model("app", "LatexDocument")
    
    for explanation in Explanation.objects.all():
        # 解説のLatexDocumentを作成
        # バージョンは1から開始（既存の解説は全てversion=1として扱う）
        LatexDocument.objects.create(
            problem=explanation.problem,
            document_type='explanation',
            latex_code=explanation.explanation_latex,
            pdf_path=explanation.explanation_pdf_path,
            version=1,
            is_confirmed=False,
            created_at=explanation.created_at,
            updated_at=explanation.updated_at,
        )


def reverse_migrate_explanations(apps, schema_editor):
    """
    マイグレーションのロールバック（解説データを復元）
    """
    Explanation = apps.get_model("app", "Explanation")
    LatexDocument = apps.get_model("app", "LatexDocument")
    
    # 解説のLatexDocumentをExplanationに戻す
    explanation_docs = LatexDocument.objects.filter(document_type='explanation')
    for doc in explanation_docs:
        # 元のlatex_documentを取得（問題のLatexDocument）
        problem_docs = LatexDocument.objects.filter(
            problem=doc.problem,
            document_type='problem'
        ).order_by('-version')
        
        source_latex_doc = problem_docs.first() if problem_docs.exists() else None
        
        Explanation.objects.create(
            problem=doc.problem,
            latex_document=source_latex_doc,
            explanation_latex=doc.latex_code,
            explanation_pdf_path=doc.pdf_path,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0005_rename_app_latext_user_id_2a3f4e_idx_latex_templ_user_id_5e816f_idx'),
    ]

    operations = [
        # Problemにtitleフィールドを追加
        migrations.AddField(
            model_name='problem',
            name='title',
            field=models.CharField(blank=True, help_text='プロジェクトタイトル', max_length=200),
        ),
        # 既存のインデックスを削除（0001_initial.pyで作成されたもの）
        migrations.RemoveIndex(
            model_name='latexdocument',
            name='latex_docum_problem_1efc67_idx',
        ),
        # unique_together制約を変更する前に、既存のunique_togetherを削除
        migrations.AlterUniqueTogether(
            name='latexdocument',
            unique_together=set(),
        ),
        # LatexDocumentにdocument_typeフィールドを追加（デフォルト値: 'problem'）
        migrations.AddField(
            model_name='latexdocument',
            name='document_type',
            field=models.CharField(
                choices=[('problem', '問題'), ('explanation', '解説')],
                default='problem',
                help_text='ドキュメントタイプ（問題または解説）',
                max_length=20,
            ),
        ),
        # 新しいunique_together制約を追加（document_typeを含む）
        migrations.AlterUniqueTogether(
            name='latexdocument',
            unique_together={('problem', 'document_type', 'version')},
        ),
        # 新しいインデックスを追加
        migrations.AddIndex(
            model_name='latexdocument',
            index=models.Index(fields=['problem', 'document_type', '-version'], name='latex_doc_problem_type_version_idx'),
        ),
        # ExplanationデータをLatexDocumentに移行（制約変更後）
        migrations.RunPython(
            migrate_explanations_to_latex_documents,
            reverse_migrate_explanations,
        ),
        # Explanationテーブルを削除
        migrations.DeleteModel(
            name='Explanation',
        ),
    ]
