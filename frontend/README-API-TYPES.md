# API型の自動生成

このプロジェクトでは、バックエンドのOpenAPIスキーマからTypeScriptの型定義を自動生成しています。

## セットアップ

1. 依存関係をインストール:
```bash
pnpm install
```

## 型の生成

バックエンドサーバーが起動している状態で、以下のコマンドを実行します:

```bash
pnpm run generate:api
```

このコマンドは:
1. バックエンドサーバー（デフォルト: `http://localhost:8000`）からOpenAPIスキーマを取得
2. TypeScriptの型定義を `src/generated/api` に生成
3. `format: binary`を`Blob`型として生成（ファイルアップロード用）

## 生成されるファイル

- `src/generated/api/index.ts` - 生成された型定義（`paths`型を含む）

## 使用方法

このプロジェクトでは`openapi-typescript`と`openapi-fetch`を使用しています。

### 型生成のカスタマイズ

`scripts/generate-api-types.ts`では、`openapi-typescript`のtransform APIを使用して`format: binary`を`Blob`型に変換しています。これにより、ファイルアップロードAPIで正しい型が生成されます。

### APIクライアントの使用例

```typescript
import { getApiClient } from '@/lib/api/server';
import type { paths } from '@/generated/api';

// APIクライアントを取得
const api = await getApiClient();

// GETリクエストの例
const { data, error } = await api.GET('/api/project/');
if (error) {
  // エラーハンドリング
  throw error;
}

// POSTリクエストの例（JSON）
const { data, error } = await api.POST('/api/project/create/', {
  body: {
    title: '新しいプロジェクト',
  },
});

// POSTリクエストの例（multipart/form-data）
const { data, error } = await api.POST('/api/ocr/', {
  body: {
    image: imageFile, // Blob型
    problem_id: problemId,
  },
  bodySerializer(body) {
    // FormDataを作成してmultipart/form-dataとして送信
    const formData = new FormData();
    formData.append('image', body.image);
    formData.append('problem_id', body.problem_id);
    return formData;
  },
});
```

### 型の使用例

```typescript
import type { paths } from '@/generated/api';

// レスポンスの型を取得
type ProjectResponse = paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json'];

// リクエストボディの型を取得
type CreateProjectRequest = paths['/api/project/create/']['post']['requestBody']['content']['application/json'];
```

## 環境変数

`NEXT_PUBLIC_API_BASE_URL`環境変数でバックエンドのURLを変更できます:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000 pnpm run generate:api
```

## 注意事項

- バックエンドのAPIスキーマが変更されたら、型を再生成してください
- 生成されたファイルは `.gitignore` に含まれています（必要に応じて変更してください）
- 生成されたファイルは手動で編集しないでください（再生成時に上書きされます）
- `format: binary`は自動的に`Blob`型として生成されます
- `multipart/form-data`を使用する場合は、`bodySerializer`を使用してFormDataを作成する必要があります

## 参考リンク

- [openapi-typescript](https://openapi-ts.dev/)
- [openapi-fetch](https://openapi-fetch.dev/)
