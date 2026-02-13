# Generated manually

from django.db import migrations


def migrate_latex_documents_to_problem_latex_documents(apps, schema_editor):
    """
    既存のLatexDocument（document_type='problem'）をProblemLatexDocumentに移行
    """
    LatexDocument = apps.get_model('app', 'LatexDocument')
    ProblemLatexDocument = apps.get_model('app', 'ProblemLatexDocument')

    # document_type='problem'のLatexDocumentを取得
    problem_docs = LatexDocument.objects.filter(document_type='problem')

    for doc in problem_docs:
        ProblemLatexDocument.objects.create(
            id=doc.id,
            problem=doc.problem,
            latex_code=doc.latex_code,
            pdf_path=doc.pdf_path,
            version=doc.version,
            is_confirmed=doc.is_confirmed,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
        )


def migrate_explanation_documents_to_explanations(apps, schema_editor):
    """
    既存のLatexDocument（document_type='explanation'）を新しいExplanationモデルに移行
    """
    LatexDocument = apps.get_model('app', 'LatexDocument')
    Explanation = apps.get_model('app', 'Explanation')
    ProblemLatexDocument = apps.get_model('app', 'ProblemLatexDocument')

    # document_type='explanation'のLatexDocumentを取得
    explanation_docs = LatexDocument.objects.filter(
        document_type='explanation')

    for doc in explanation_docs:
        # 解説生成時に使用した問題LaTeXドキュメントを探す
        # 問題の最新の確認済みProblemLatexDocumentを取得
        source_problem_latex = None
        if doc.problem:
            source_problem_latex = ProblemLatexDocument.objects.filter(
                problem=doc.problem,
                is_confirmed=True
            ).order_by('-version').first()

            # 確認済みがない場合は最新のものを取得
            if not source_problem_latex:
                source_problem_latex = ProblemLatexDocument.objects.filter(
                    problem=doc.problem
                ).order_by('-version').first()

        # 新しいExplanationレコードを作成
        Explanation.objects.create(
            id=doc.id,
            problem=doc.problem,
            source_problem_latex=source_problem_latex,
            latex_code=doc.latex_code,
            pdf_path=doc.pdf_path,
            version=doc.version,
            is_confirmed=doc.is_confirmed,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
        )


def reverse_migrate_problem_latex_documents(apps, schema_editor):
    """
    ロールバック用：ProblemLatexDocumentをLatexDocumentに戻す
    """
    LatexDocument = apps.get_model('app', 'LatexDocument')
    ProblemLatexDocument = apps.get_model('app', 'ProblemLatexDocument')

    for doc in ProblemLatexDocument.objects.all():
        LatexDocument.objects.create(
            id=doc.id,
            problem=doc.problem,
            document_type='problem',
            latex_code=doc.latex_code,
            pdf_path=doc.pdf_path,
            version=doc.version,
            is_confirmed=doc.is_confirmed,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
        )


def reverse_migrate_explanations(apps, schema_editor):
    """
    ロールバック用：新しいExplanationをLatexDocumentに戻す
    """
    LatexDocument = apps.get_model('app', 'LatexDocument')
    Explanation = apps.get_model('app', 'Explanation')

    for exp in Explanation.objects.all():
        LatexDocument.objects.create(
            id=exp.id,
            problem=exp.problem,
            document_type='explanation',
            latex_code=exp.latex_code,
            pdf_path=exp.pdf_path,
            version=exp.version,
            is_confirmed=exp.is_confirmed,
            created_at=exp.created_at,
            updated_at=exp.updated_at,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0010_update_explanation_model'),
    ]

    operations = [
        migrations.RunPython(
            migrate_latex_documents_to_problem_latex_documents,
            reverse_migrate_problem_latex_documents,
        ),
        migrations.RunPython(
            migrate_explanation_documents_to_explanations,
            reverse_migrate_explanations,
        ),
    ]
