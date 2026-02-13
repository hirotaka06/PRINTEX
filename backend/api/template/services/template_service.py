from django.contrib.auth.models import User
from app.models.latex_template import LatexTemplate


def get_user_template(user: User) -> LatexTemplate | None:
    try:
        return LatexTemplate.objects.get(user=user, is_default=True)
    except LatexTemplate.DoesNotExist:
        return None


def get_system_default_template() -> LatexTemplate:
    return LatexTemplate.objects.get(user=None, name="システムデフォルト")


def wrap_latex_with_template(latex_code: str, template: LatexTemplate) -> str:
    return template.content.replace("{children}", latex_code)
