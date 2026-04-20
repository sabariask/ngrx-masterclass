import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Counter } from './counter/counter';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: Dashboard
    },
    {
        path: 'counter',
        component: Counter
    },
    {
        path: 'todos',
        loadComponent: () => import('./todos/todo-list/todo-list').then(m => m.TodoList)
    },
    {
        path: "**",
        redirectTo: 'dashboard'
    }
];
