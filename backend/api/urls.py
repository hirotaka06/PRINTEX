from django.urls import path, include

urlpatterns = [
    path("auth/", include("api.auth.urls")),
    path("ocr/", include("api.ocr.urls")),
    path("latex/", include("api.latex.urls")),
    path("explanation/", include("api.explanation.urls")),
    path("template/", include("api.template.urls")),
    path("project/", include("api.project.urls")),
]
