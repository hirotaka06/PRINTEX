import os
from datetime import datetime
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.files.base import ContentFile


class FileStorage:
    @staticmethod
    def save_image(image_file, folder_name="images", prefix=""):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        file_name = f"{prefix}_{timestamp}.png" if prefix else f"{timestamp}.png"
        file_path = os.path.join(folder_name, file_name)

        storage = FileSystemStorage(location=settings.MEDIA_ROOT)
        saved_path = storage.save(file_path, image_file)
        return saved_path

    @staticmethod
    def save_latex_file(latex_code, folder_name="latex", prefix=""):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        file_name = f"{prefix}_{timestamp}.tex" if prefix else f"{timestamp}.tex"
        file_path = os.path.join(folder_name, file_name)

        storage = FileSystemStorage(location=settings.MEDIA_ROOT)
        content_file = ContentFile(latex_code.encode("utf-8"))
        saved_path = storage.save(file_path, content_file)
        return saved_path

    @staticmethod
    def save_pdf(pdf_content, folder_name="pdfs", prefix=""):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")
        file_name = f"{prefix}_{timestamp}.pdf" if prefix else f"{timestamp}.pdf"
        file_path = os.path.join(folder_name, file_name)

        storage = FileSystemStorage(location=settings.MEDIA_ROOT)
        content_file = ContentFile(pdf_content)
        saved_path = storage.save(file_path, content_file)
        return saved_path

    @staticmethod
    def get_file_url(file_path):
        # PDFファイルの場合は専用のエンドポイントを使用（X-Frame-Optionsを無効化）
        if file_path.endswith('.pdf'):
            # file_pathから先頭のスラッシュを削除（既に削除されている場合もある）
            clean_path = file_path.lstrip('/')
            return f"/api/latex/pdf/{clean_path}"
        # その他のファイルは通常のメディアURLを使用
        return f"{settings.MEDIA_URL}{file_path}"

    @staticmethod
    def file_exists(file_path):
        if not file_path:
            return False
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        return os.path.exists(full_path) and os.path.isfile(full_path)

    @staticmethod
    def delete_file(file_path):
        if not file_path:
            return True
        full_path = os.path.join(settings.MEDIA_ROOT, file_path)
        try:
            if os.path.exists(full_path) and os.path.isfile(full_path):
                os.remove(full_path)
            return True
        except OSError:
            return False
