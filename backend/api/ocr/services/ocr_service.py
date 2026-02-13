import os
from pix2text import Pix2Text
from app.utils.ai_client import OpenAIClient


class OCRService:
    def __init__(self):
        self.p2t = Pix2Text()
        self.ai_client = OpenAIClient()

    def process_image_to_latex(self, image_path):
        from django.conf import settings

        if os.path.isabs(image_path):
            full_image_path = image_path
        else:
            full_image_path = os.path.join(settings.MEDIA_ROOT, image_path)

        if not os.path.exists(full_image_path):
            raise FileNotFoundError(
                f"画像ファイルが見つかりません: {full_image_path} (相対パス: {image_path})"
            )

        self.p2t = Pix2Text()
        ocr_result = self.p2t.recognize(full_image_path)

        ocr_text = ""
        if isinstance(ocr_result, list):
            ocr_text = "\n".join([str(item) for item in ocr_result])
        else:
            ocr_text = str(ocr_result)

        latex_code = self.ai_client.correct_latex_from_ocr(
            ocr_text, full_image_path)

        return latex_code
