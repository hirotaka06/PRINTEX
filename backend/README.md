# MathOCR バックエンド

数学問題のOCR・LaTeX編集・PDF生成・AI解説生成を提供するDjango REST Framework APIです。

## 技術スタック

- **Django 4.2** + **Django REST Framework**
- **PostgreSQL**（データベース）
- **OpenAPI (drf-spectacular)**（APIドキュメント・スキーマ）
- **pix2text**（画像からのLaTeX認識）
- **OpenAI API**（解説文の生成）
- **python-dotenv**（環境変数）

## 主な機能

1. **認証**: ログイン・ログアウト・セッション認証・CSRFトークン取得
2. **プロジェクト**: 作成・一覧・詳細・更新・削除・ゴミ箱（論理削除・復元）
3. **OCR**: 画像アップロードでLaTeXコードを生成（pix2text + AI校正）
4. **LaTeXレンダリング**: 編集したLaTeXをPDFに変換
5. **解説生成**: OpenAI による問題の解説LaTeX・PDF生成
6. **テンプレート**: LaTeX文書テンプレートのCRUD
7. **バージョン履歴**: 問題文・解説のバージョン管理

## セットアップ

### 前提条件

- Python 3.10 以上
- PostgreSQL（稼働中）
- （PDF生成用）TeXLive 等の LaTeX 環境（`pdflatex` または `platex` が利用可能であること）
- （解説生成用）OpenAI API キー

### 1. 仮想環境の作成と有効化

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
# または
venv\Scripts\activate     # Windows
```

### 2. 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 3. 環境変数の設定

**必須です。** `.env` がないと `SECRET_KEY` 未設定で起動エラーになります。

```bash
cp .env.example .env
```

`.env` を編集し、少なくとも以下を設定してください。

- `SECRET_KEY`: Django用の秘密鍵（本番では推測困難なランダム文字列にすること）
- `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`: PostgreSQLの接続情報
- `OPENAI_API_KEY`: 解説生成用のOpenAI APIキー

### 4. データベースのマイグレーション

```bash
python manage.py migrate
```

### 5. スーパーユーザーの作成（ログイン用）

```bash
python manage.py createsuperuser
```

### 6. 開発サーバーの起動

```bash
python manage.py runserver
```

http://localhost:8000 でAPIが利用可能になります。

## APIドキュメント

開発サーバー起動後：

- **Swagger UI**: http://localhost:8000/api/docs/
- **OpenAPI Schema (JSON)**: http://localhost:8000/api/schema/

## 主なAPIエンドポイント（概要）

| カテゴリ     | 例 |
|--------------|----|
| 認証         | `POST /api/auth/login/`, `POST /api/auth/logout/`, `GET /api/auth/user/`, `GET /api/csrf/` |
| プロジェクト | `GET/POST /api/project/`, `GET/PATCH/DELETE /api/project/{id}/`, 復元・ゴミ箱一覧 |
| OCR          | `POST /api/ocr/`（画像 + problem_id） |
| LaTeX        | `POST /api/latex/render/`（latex_document_id, latex_code） |
| 解説         | `POST /api/explanation/generate/`（problem_id, latex_document_id） |
| テンプレート | `GET/POST /api/template/`, `GET/PATCH/DELETE /api/template/{id}/` |

詳細は Swagger UI または OpenAPI Schema を参照してください。

## プロジェクト構造

```
backend/
├── config/              # Django設定（settings, urls）
├── api/                 # APIアプリ
│   ├── auth/            # 認証（login, logout, user, csrf）
│   ├── ocr/             # OCR
│   ├── latex/           # LaTeXレンダリング・PDF
│   ├── explanation/     # 解説生成
│   ├── template/        # テンプレートCRUD
│   ├── project/         # プロジェクト・バージョン履歴
│   └── shared/          # 共通ビュー等
├── app/                 # コアアプリ
│   ├── models/          # モデル（Problem, LatexDocument, Explanation 等）
│   └── utils/           # ファイル保存・AIクライアント等
├── manage.py
├── requirements.txt
└── .env.example         # 環境変数テンプレート（.env は git に含めない）
```

## 必要な外部ツール・サービス

- **PostgreSQL**: データベース
- **LaTeX**: PDF生成（`LATEX_TO_PDF_COMMAND` で `pdflatex` または `platex` を指定可能）
- **OpenAI API**: 解説生成（APIキーを `.env` の `OPENAI_API_KEY` に設定）

## 注意事項

- 本番環境では `DEBUG=False` にし、`SECRET_KEY` を強力なランダム値に設定してください。
- `.env` には秘密情報が含まれるため、リポジトリにコミットしないでください（`.gitignore` で除外済み）。
- ルートの `SECURITY.md` に、公開前に確認すべき事項をまとめています。
