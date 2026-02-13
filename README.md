# MathOCR

数学問題の画像をOCRでLaTeXに変換し、編集・解説生成・PDF出力まで行うWebアプリケーションです。

## 主な機能

- **ログイン・認証**: セッション認証（Cookie）とCSRF対策
- **プロジェクト管理**: プロジェクトの作成・一覧・編集・削除・ゴミ箱（論理削除と復元）
- **OCR**: 数学問題の画像アップロード → LaTeXコードの自動生成（pix2text + AI校正）
- **LaTeX編集**: 問題文・解説のLaTeXを編集し、リアルタイムでPDFプレビュー
- **解説生成**: OpenAI API を用いた解説文の自動生成とPDF出力
- **テンプレート**: LaTeX文書テンプレートの登録・選択
- **バージョン履歴**: 問題文・解説のバージョン管理

## 技術スタック

| 役割       | 技術 |
|------------|------|
| フロントエンド | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS |
| バックエンド   | Django 4.2, Django REST Framework, PostgreSQL |
| OCR・PDF    | pix2text, LaTeX (pdflatex/platex), OpenAI API |
| API仕様     | OpenAPI (drf-spectacular), 型生成 (openapi-typescript) |

## リポジトリ構成

```
MathOCR/
├── backend/          # Django API（このREADMEの「バックエンドの起動」を参照）
├── frontend/         # Next.js アプリ（このREADMEの「フロントエンドの起動」を参照）
└── README.md         # 本ファイル（プロジェクト全体の説明）
```

## クイックスタート

### 前提条件

- **Node.js** 18 以上（フロントエンド）
- **Python** 3.10 以上（バックエンド）
- **PostgreSQL**（稼働中）
- **LaTeX**（TeXLive 等で `pdflatex` または `platex` が利用可能）
- **OpenAI API キー**（解説生成を使う場合）

### 1. バックエンドの起動

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows の場合は venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # .env を編集し、DB・SECRET_KEY・OPENAI_API_KEY を設定
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

→ API は http://localhost:8000 で利用可能です。Swagger UI: http://localhost:8000/api/docs/

### 2. フロントエンドの起動

```bash
cd frontend
npm install
cp .env.example .env      # 必要に応じて API の URL を変更（デフォルトは http://localhost:8000）
npm run dev
```

→ アプリは http://localhost:3000 で開けます。

### 3. 動作確認

1. http://localhost:3000 にアクセス → 未ログインなら `/login` にリダイレクト
2. バックエンドで作成したスーパーユーザーでログイン
3. プロジェクト一覧（`/project`）で新規作成 → エディタで画像アップロード（OCR）・LaTeX編集・解説生成を試す

## 各ディレクトリのREADME

- **[backend/README.md](backend/README.md)** … バックエンドのセットアップ・API一覧・プロジェクト構造
- **[frontend/README.md](frontend/README.md)** … フロントエンドのセットアップ・機能・バックエンド連携
