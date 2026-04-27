import { getRouterSelectors } from '@ngrx/router-store';
import { createSelector } from '@ngrx/store';

export const {
  selectCurrentRoute,
  selectFragment,
  selectQueryParam,
  selectQueryParams,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
  selectTitle,
} = getRouterSelectors();

export const selectTodoIdFromRoute = createSelector(selectRouteParams, (params) =>
  params?.['id'] ? Number(params['id']) : null,
);

export const selectCurrentPage = createSelector(selectQueryParams, (params) =>
  params?.['page'] ? Number(params['page']) : 1,
);

export const selectSortParam = createSelector(
  selectQueryParams,
  (params) => params?.['sort'] ?? 'createdAt',
);

export const selectIsOnTodosRoute = createSelector(
  selectUrl,
  (url) => url?.startsWith('/todos') ?? false,
);

export const selectIsOnDetailPage = createSelector(selectRouteParams, (params) => !!params?.['id']);
