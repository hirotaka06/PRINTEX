from django.urls import path
from api.ocr.views.ocr_view import OCRView

urlpatterns = [
    path("", OCRView.as_view(), name="ocr"),
]
