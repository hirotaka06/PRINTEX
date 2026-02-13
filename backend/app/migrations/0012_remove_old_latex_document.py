# Generated manually

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0011_migrate_data_to_new_models'),
    ]

    operations = [
        # 注意: このマイグレーションは段階的に実行する必要があります
        # 1. まず、既存のLatexDocumentテーブルが空であることを確認
        # 2. すべてのデータがProblemLatexDocumentとExplanationに移行されていることを確認
        # 3. その後、このマイグレーションを実行してLatexDocumentモデルを削除
        
        # 注意: 実際の削除は後で行うため、ここではコメントアウト
        # migrations.DeleteModel(
        #     name='LatexDocument',
        # ),
    ]
