from django.urls import path
from api.latex.views.latex_render_view import LatexRenderView
from api.latex.views.pdf_view import PDFView

urlpatterns = [
    path("render/", LatexRenderView.as_view(), name="latex-render"),
    path("pdf/<path:file_path>", PDFView.as_view(), name="pdf-view"),
]
