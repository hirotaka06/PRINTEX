from django.urls import path
from api.template.views.template_view import (
    LatexTemplateListView,
    LatexTemplateDetailView,
    LatexTemplateSetDefaultView,
)

urlpatterns = [
    path("", LatexTemplateListView.as_view(), name="template-list"),
    path("<uuid:pk>/", LatexTemplateDetailView.as_view(), name="template-detail"),
    path(
        "<uuid:pk>/set-default/",
        LatexTemplateSetDefaultView.as_view(),
        name="template-set-default",
    ),
]
