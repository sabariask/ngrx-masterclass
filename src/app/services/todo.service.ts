import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { delay, map, Observable, of } from "rxjs";
import { Todo } from "../models/todo.model";


@Injectable({ providedIn: 'root' })
export class TodoService {
    private apiUrl = "https://jsonplaceholder.typicode.com";
    private http = inject(HttpClient);

    getTodos(): Observable<Todo[]> {
        return this.http.get<any[]>(`${this.apiUrl}/todos`).pipe(
            map(todos => todos.slice(0, 5).map(t => ({
                id: t.id,
                title: t.title,
                completed: t.completed,
                decription: '',
                priority: 'medium' as const,
                userId: t.userId,
                createdAt: new Date().toISOString()
            })))
        )
    }

    getMockTodos(): Observable<Todo[]> {
        const mockTodos: Todo[] = [
            {
                id: 1,
                title: 'Learn NgRx Actions',
                description: 'Study createAction and action creators',
                completed: false,
                priority: 'high',
                userId: 1,
                createdAt: '2024-01-15',
                dueDate: '2024-01-20'
            },
            {
                id: 2,
                title: 'Build Counter App',
                description: 'Practice with BehaviorSubject',
                completed: true,
                priority: 'medium',
                userId: 1,
                createdAt: '2024-01-14'
            },
            {
                id: 3,
                title: 'Master RxJS Operators',
                description: 'switchMap, mergeMap, catchError',
                completed: false,
                priority: 'high',
                userId: 1,
                createdAt: '2024-01-13',
                dueDate: '2024-01-18'
            }
        ];
        return of(mockTodos).pipe(delay(800));
    }

    addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Observable<Todo> {
        const newTodo: Todo = {
            ...todo,
            id: Math.floor(Math.random() * 10000),
            createdAt: new Date().toISOString()
        };
        return of(newTodo).pipe(delay(300));
    }

    toggleTodo(id: number): Observable<{id: number, completed: boolean}> {
        return of({id, completed: true}).pipe(delay(200));
    }

    deleteTodo(id: number): Observable<number> {
        return of(id).pipe(delay(300));
    }
}