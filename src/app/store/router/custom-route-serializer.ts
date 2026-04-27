import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterStateSerializer } from '@ngrx/router-store';

export interface RouterStateUrl {
  url: string;
  params: { [key: string]: string };
  queryParams: { [key: string]: string };
  fragment: string | null;
  data: { [key: string]: any };
}

@Injectable()
export class CustomSerializer implements RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    let route: ActivatedRouteSnapshot = routerState.root;
    let depth = 0;

    console.log('=== CustomSerializer START ===');
    console.log('Full URL:', routerState.url);

    let current: ActivatedRouteSnapshot | null = routerState.root;

    while (current) {
      console.log(`Level ${depth}:`, {
        url: current.url.map((u) => u.path).join('/'),
        params: current.params,
        routeConfig: current.routeConfig?.path,
        childern: current.children.length,
      });

      depth++;
      current = current.firstChild;
    }

    while (route.firstChild) {
      route = route.firstChild;
    }

    console.log('Deepest params:', route.params);
    console.log('=== CustomSerializer END ===');

    return {
      url: routerState.url,
      params: { ...route.params },
      queryParams: { ...routerState.root.queryParams },
      fragment: routerState.root.fragment,
      data: { ...route.data },
    };
  }
}
