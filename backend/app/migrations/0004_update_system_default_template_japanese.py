# Generated manually to add Japanese support to system default template

from django.db import migrations


def update_system_default_template(apps, schema_editor):
    """
    システムデフォルトテンプレートを日本語対応に更新
    platex/uplatexで動作するようにjsarticleクラスを使用
    """
    LatexTemplate = apps.get_model("app", "LatexTemplate")
    template = LatexTemplate.objects.filter(user=None, name="システムデフォルト").first()
    if template:
        # platex/uplatexでjsarticleを使う場合のテンプレート
        template.content = """\\documentclass{jsarticle}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\begin{document}

{children}

\\end{document}"""
        template.save()


def reverse_update_system_default_template(apps, schema_editor):
    """
    システムデフォルトテンプレートを元に戻す
    """
    LatexTemplate = apps.get_model("app", "LatexTemplate")
    template = LatexTemplate.objects.filter(user=None, name="システムデフォルト").first()
    if template:
        template.content = """\\documentclass{article}
\\usepackage{amsmath}

\\begin{document}

{children}

\\end{document}"""
        template.save()


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0003_make_original_image_path_optional"),
    ]

    operations = [
        migrations.RunPython(
            update_system_default_template, reverse_update_system_default_template
        ),
    ]
