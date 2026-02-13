import type { paths } from '@/generated/api';

export type ProjectDetail = NonNullable<
  paths['/api/project/{id}/']['get']['responses']['200']['content']['application/json']
>;

export type ProjectListItem = NonNullable<
  paths['/api/project/']['get']['responses']['200']['content']['application/json']
>[number];

export type TrashedProjectItem = NonNullable<
  paths['/api/project/trash/']['get']['responses']['200']['content']['application/json']
>[number];

export type ProjectCreateRequest = NonNullable<
  paths['/api/project/create/']['post']['requestBody']
>['content']['application/json'];

export type ProjectUpdateRequest = NonNullable<
  paths['/api/project/{id}/']['patch']['requestBody']
>['content']['application/json'];

export type ProjectCreateResponse =
  paths['/api/project/create/']['post']['responses']['201']['content']['application/json'];

export type ProjectSortBy = 'created_at' | 'updated_at' | 'title';
