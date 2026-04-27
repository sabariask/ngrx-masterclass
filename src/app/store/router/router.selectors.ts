import { getRouterSelectors, RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterStateUrl } from './custom-route-serializer';

export const selectRouterState =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const selectCurrentRouterState = createSelector(selectRouterState, (router) => router?.state);

export const selectCurrentUrl = createSelector(
  selectCurrentRouterState,
  (state) => state.url ?? '',
);

export const selectRouteParams = createSelector(
  selectCurrentRouterState,
  (state) => state?.params ?? {},
);

export const selectTodoIdFromRoute = createSelector(selectRouteParams, (params) => {
  console.log('selectTodoIdFromRoute params:', params);
  return params['id'] ? Number(params['id']) : null;
});

export const selectQueryParams = createSelector(
  selectCurrentRouterState,
  (state) => state.queryParams ?? {},
);

export const selectCurrentPage = createSelector(selectQueryParams, (params) =>
  params?.['page'] ? Number(params['page']) : 1,
);

export const selectSortParam = createSelector(
  selectQueryParams,
  (params) => params?.['sort'] ?? 'createdAt',
);

export const selectIsOnTodosRoute = createSelector(
  selectCurrentUrl,
  (url) => url?.startsWith('/todos') ?? false,
);

export const selectIsOnDetailPage = createSelector(
  selectRouteParams,
  (params) => !!params?.['id'],
);
