import base64
from django.conf import settings
from openai import OpenAI
from api.ocr.prompts.ocr_correction_prompt import (
    ocr_correction_system_prompt,
    ocr_correction_user_prompt,
)


class OpenAIClient:
    def __init__(self):
        api_key = settings.OPENAI_API_KEY
        if not api_key:
            raise ValueError("OPENAI_API_KEYが設定されていません")
        self.client = OpenAI(api_key=api_key)
        self.model = settings.OPENAI_MODEL

    def correct_latex_from_ocr(self, ocr_result, image_path, system_prompt=None, user_prompt=None):
        # 画像ファイルを読み込んでbase64エンコード
        with open(image_path, "rb") as image_file:
            image_data = image_file.read()
            image_base64 = base64.b64encode(image_data).decode("utf-8")

        # プロンプトが指定されていない場合は、デフォルトのプロンプトを使用
        if system_prompt is None:
            system_prompt = ocr_correction_system_prompt

        if user_prompt is None:
            # OCR結果をプロンプトに挿入
            if "{ocr_result}" in ocr_correction_user_prompt:
                user_prompt = ocr_correction_user_prompt.format(
                    ocr_result=ocr_result)
            else:
                user_prompt = ocr_correction_user_prompt
        else:
            # ユーザープロンプトにocr_resultが含まれている場合はフォーマット
            if "{ocr_result}" in user_prompt:
                user_prompt = user_prompt.format(ocr_result=ocr_result)

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": user_prompt},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{image_base64}"
                            },
                        },
                    ],
                },
            ],
            temperature=0.1,
        )

        return response.choices[0].message.content

    def generate_explanation(self, problem_latex, solution_notes=None, system_prompt=None, user_prompt=None):
        from api.explanation.prompts.explanation_generation_prompt import (
            explanation_generation_system_prompt,
            explanation_generation_user_prompt,
        )

        # プロンプトが指定されていない場合は、デフォルトのプロンプトを使用
        if system_prompt is None:
            system_prompt = explanation_generation_system_prompt

        if user_prompt is None:
            # solution_notesがある場合はプロンプトに含める
            solution_notes_section = ""
            if solution_notes and solution_notes.strip():
                solution_notes_section = f"\n\n解法の参考情報:\n{solution_notes.strip()}"

            user_prompt = explanation_generation_user_prompt.format(
                problem_latex=problem_latex,
                solution_notes_section=solution_notes_section
            )
        else:
            # ユーザープロンプトにproblem_latexが含まれている場合はフォーマット
            if "{problem_latex}" in user_prompt:
                solution_notes_section = ""
                if solution_notes and solution_notes.strip():
                    solution_notes_section = f"\n\n解法の参考情報:\n{solution_notes.strip()}"
                user_prompt = user_prompt.format(
                    problem_latex=problem_latex,
                    solution_notes_section=solution_notes_section
                )

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.3,
        )

        return response.choices[0].message.content
