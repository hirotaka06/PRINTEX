/**
 * テンプレートエンティティの型定義
 */

import type { paths } from '@/generated/api';

/**
 * テンプレート一覧アイテムの型定義
 */
export type TemplateListItem = NonNullable<
  paths['/api/template/']['get']['responses']['200']['content']['application/json']
>[number];

/**
 * テンプレート作成リクエストの型定義
 */
export type TemplateCreateRequest = NonNullable<
  paths['/api/template/']['post']['requestBody']
>['content']['application/json'];

/**
 * テンプレート更新リクエストの型定義
 */
export type TemplateUpdateRequest = NonNullable<
  paths['/api/template/{id}/']['patch']['requestBody']
>['content']['application/json'];
