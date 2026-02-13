# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_add_title_to_problem_and_refactor_latex_document'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='solution_notes',
            field=models.TextField(blank=True, help_text='解法のメモ（解説生成時に参考にされます）'),
        ),
    ]
