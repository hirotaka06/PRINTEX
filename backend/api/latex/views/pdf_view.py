from django.http import FileResponse, Http404
from django.conf import settings
from django.views.decorators.cache import cache_control
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.clickjacking import xframe_options_exempt
import os


@method_decorator(xframe_options_exempt, name='dispatch')
@method_decorator(cache_control(private=True, max_age=3600), name='dispatch')
class PDFView(View):
    def get(self, request, file_path):
        file_path = file_path.lstrip('/')
        if '..' in file_path or file_path.startswith('/'):
            raise Http404("Invalid file path")

        if not file_path.endswith('.pdf'):
            raise Http404("Only PDF files are allowed")

        full_path = os.path.join(settings.MEDIA_ROOT, file_path)

        if not os.path.exists(full_path) or not os.path.isfile(full_path):
            raise Http404("PDF file not found")

        response = FileResponse(
            open(full_path, 'rb'),
            content_type='application/pdf'
        )

        return response
