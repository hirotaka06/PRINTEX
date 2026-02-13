# Generated manually for making original_image_path optional

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0002_latex_template"),
    ]

    operations = [
        migrations.AlterField(
            model_name="problem",
            name="original_image_path",
            field=models.CharField(
                blank=True,
                help_text="元画像のパス（画像なしの場合は空文字列）",
                max_length=500,
            ),
        ),
    ]
