# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_add_solution_notes_to_problem'),
    ]

    operations = [
        migrations.AddField(
            model_name='problem',
            name='deleted_at',
            field=models.DateTimeField(blank=True, help_text='削除日時（ソフトデリート用）', null=True),
        ),
    ]
