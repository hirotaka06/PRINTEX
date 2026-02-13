"""
Explanation API URL Configuration
"""
from django.urls import path
from api.explanation.views.explanation_view import ExplanationView

urlpatterns = [
    path("generate/", ExplanationView.as_view(), name="explanation-generate"),
]
