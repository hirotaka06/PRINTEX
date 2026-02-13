import re
from app.utils.ai_client import OpenAIClient
from api.latex.services.pdf_service import PDFService


class ExplanationService:
    def __init__(self):
        self.ai_client = OpenAIClient()
        self.pdf_service = PDFService()

    def _extract_latex_from_response(self, response_text):
        if not response_text:
            return response_text

        # マークダウンのコードブロック記法を除去
        # ```latex ... ``` または ``` ... ``` のパターンを検出
        pattern = r'```(?:latex)?\s*\n?(.*?)\n?```'
        match = re.search(pattern, response_text, re.DOTALL)

        if match:
            # コードブロック内のLaTeXコードを抽出
            extracted = match.group(1).strip()
        else:
            # コードブロック記法がない場合は、そのまま返す
            extracted = response_text.strip()

        # ドキュメント構造を除去して本文のみを抽出
        extracted = self._extract_document_body(extracted)

        return extracted

    def _extract_document_body(self, latex_code):
        if not latex_code:
            return latex_code

        lines = latex_code.split('\n')
        body_lines = []
        in_preamble = True
        in_document = False

        for line in lines:
            stripped = line.strip()

            # プリアンブル部分をスキップ
            if in_preamble:
                # \documentclass や \usepackage などのプリアンブルコマンドをスキップ
                if re.match(r'\\documentclass', stripped, re.IGNORECASE):
                    continue
                if re.match(r'\\usepackage', stripped, re.IGNORECASE):
                    continue
                if re.match(r'\\geometry', stripped, re.IGNORECASE):
                    continue
                if re.match(r'\\pagestyle', stripped, re.IGNORECASE):
                    continue
                if re.match(r'\\setlength', stripped, re.IGNORECASE):
                    continue
                # \begin{document} が見つかったら、その行をスキップして本文開始
                if re.match(r'\\begin\{document\}', stripped, re.IGNORECASE):
                    in_preamble = False
                    in_document = True
                    continue

            # \end{document} が見つかったら終了
            if re.match(r'\\end\{document\}', stripped, re.IGNORECASE):
                break

            # 本文部分を追加
            if in_document or not in_preamble:
                body_lines.append(line)

        # 本文が抽出できなかった場合は、元のコードを返す（既に本文のみの可能性）
        if not body_lines:
            return latex_code.strip()

        result = '\n'.join(body_lines).strip()

        # 空の場合は空文字列を返す
        if not result:
            return latex_code.strip()

        return result

    def generate_explanation(self, problem_latex, solution_notes=None):
        raw_response = self.ai_client.generate_explanation(
            problem_latex, solution_notes=solution_notes)
        explanation_latex = self._extract_latex_from_response(raw_response)

        return explanation_latex
