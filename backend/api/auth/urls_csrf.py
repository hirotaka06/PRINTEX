from django.urls import path
from api.auth.views.csrf_view import CsrfTokenView

urlpatterns = [
    path("", CsrfTokenView.as_view(), name="csrf"),
]
