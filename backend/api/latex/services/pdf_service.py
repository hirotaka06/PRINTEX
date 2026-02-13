import os
import subprocess
import tempfile
from pathlib import Path
from django.conf import settings
from app.utils.file_storage import FileStorage


class PDFService:
    def __init__(self, template_name="default"):
        self.latex_command = settings.LATEX_TO_PDF_COMMAND
        self.template_name = template_name
        self.template_dir = Path(__file__).parent.parent / "templates"

    def _load_template(self, template_name=None):
        template_name = template_name or self.template_name
        template_path = self.template_dir / f"{template_name}.tex"

        if not template_path.exists():
            raise FileNotFoundError(
                f"LaTeXテンプレートが見つかりません: {template_path}"
            )

        with open(template_path, "r", encoding="utf-8") as f:
            return f.read()

    def latex_to_pdf(self, latex_code, output_filename=None, template_name=None, use_template=False):
        if use_template:
            template_content = self._load_template(template_name)
            full_latex = template_content.replace("{latex_code}", latex_code)
        else:
            full_latex = latex_code

        with tempfile.TemporaryDirectory() as temp_dir:
            tex_file_path = os.path.join(temp_dir, "document.tex")

            with open(tex_file_path, "w", encoding="utf-8") as f:
                f.write(full_latex)

            try:
                is_platex = self.latex_command in ["platex", "uplatex"]

                if is_platex:
                    # platex/uplatexは相互参照のため2回実行が必要
                    for i in range(2):
                        result = subprocess.run(
                            [self.latex_command, "-kanji=utf8",
                                "-interaction=nonstopmode", "document.tex"],
                            cwd=temp_dir,
                            capture_output=True,
                            text=True,
                            encoding='utf-8',
                            errors='replace',
                            timeout=30,
                        )
                        if result.returncode != 0:
                            error_parts = [f"LaTeXコンパイルエラー ({i+1}回目)"]

                            if result.stderr:
                                error_parts.append(
                                    f"\n標準エラー出力:\n{result.stderr}")
                            if result.stdout:
                                error_parts.append(f"\n標準出力:\n{result.stdout}")

                            log_file_path = os.path.join(
                                temp_dir, "document.log")
                            if os.path.exists(log_file_path):
                                try:
                                    with open(log_file_path, "r", encoding="utf-8", errors="replace") as f:
                                        log_content = f.read()
                                        log_lines = log_content.split("\n")
                                        relevant_log = "\n".join(
                                            log_lines[-200:])
                                        if relevant_log.strip():
                                            error_parts.append(
                                                f"\nLaTeXログファイル:\n{relevant_log}")
                                except Exception:
                                    pass

                            error_msg = "\n".join(error_parts)
                            raise RuntimeError(error_msg)

                    dvi_file_path = os.path.join(temp_dir, "document.dvi")
                    if not os.path.exists(dvi_file_path):
                        error_parts = ["DVIファイルが生成されませんでした"]
                        error_parts.append(
                            f"\nLaTeXコマンド: {self.latex_command}")

                        log_file_path = os.path.join(temp_dir, "document.log")
                        if os.path.exists(log_file_path):
                            try:
                                with open(log_file_path, "r", encoding="utf-8", errors="replace") as f:
                                    log_content = f.read()
                                    # ログの最後の200行を取得
                                    log_lines = log_content.split("\n")
                                    relevant_log = "\n".join(log_lines[-200:])
                                    if relevant_log.strip():
                                        error_parts.append(
                                            f"\nLaTeXログファイル:\n{relevant_log}")
                            except Exception:
                                pass

                        error_msg = "\n".join(error_parts)
                        raise FileNotFoundError(error_msg)

                    pdf_file_path = os.path.join(temp_dir, "document.pdf")
                    result = subprocess.run(
                        ["dvipdfmx", "-o", "document.pdf", "document.dvi"],
                        cwd=temp_dir,
                        capture_output=True,
                        text=True,
                        encoding='utf-8',
                        errors='replace',
                        timeout=30,
                    )

                    if result.returncode != 0:
                        error_parts = ["DVIからPDFへの変換エラー"]
                        if result.stderr:
                            error_parts.append(f"\n標準エラー出力:\n{result.stderr}")
                        if result.stdout:
                            error_parts.append(f"\n標準出力:\n{result.stdout}")
                        error_msg = "\n".join(error_parts)
                        raise RuntimeError(error_msg)
                else:
                    result = subprocess.run(
                        [self.latex_command, "-interaction=nonstopmode", "document.tex"],
                        cwd=temp_dir,
                        capture_output=True,
                        text=True,
                        encoding='utf-8',
                        errors='replace',
                        timeout=30,
                    )

                    if result.returncode != 0:
                        error_parts = ["LaTeXコンパイルエラー"]

                        if result.stderr:
                            error_parts.append(f"\n標準エラー出力:\n{result.stderr}")
                        if result.stdout:
                            error_parts.append(f"\n標準出力:\n{result.stdout}")

                        log_file_path = os.path.join(temp_dir, "document.log")
                        if os.path.exists(log_file_path):
                            try:
                                with open(log_file_path, "r", encoding="utf-8", errors="replace") as f:
                                    log_content = f.read()
                                    # ログの最後の200行を取得
                                    log_lines = log_content.split("\n")
                                    relevant_log = "\n".join(log_lines[-200:])
                                    if relevant_log.strip():
                                        error_parts.append(
                                            f"\nLaTeXログファイル:\n{relevant_log}")
                            except Exception:
                                pass

                        error_msg = "\n".join(error_parts)
                        raise RuntimeError(error_msg)

                    pdf_file_path = os.path.join(temp_dir, "document.pdf")

                if not os.path.exists(pdf_file_path):
                    raise FileNotFoundError("PDFファイルが生成されませんでした")

                with open(pdf_file_path, "rb") as pdf_file:
                    pdf_content = pdf_file.read()

                saved_path = FileStorage.save_pdf(
                    pdf_content, folder_name="pdfs", prefix=output_filename or "latex"
                )

                return saved_path

            except subprocess.TimeoutExpired:
                raise RuntimeError("LaTeXコンパイルがタイムアウトしました")
            except Exception as e:
                raise RuntimeError(f"PDF生成エラー: {str(e)}")
