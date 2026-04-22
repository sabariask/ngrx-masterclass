import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of, retry, switchMap, timeout } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = 'http://localhost:3000/todos';
  private http = inject(HttpClient);

  getMockTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}`).pipe(timeout(5000), retry(2));
  }

  getTodoById(id: number = 1): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(timeout(5000));
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Observable<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
    };
    return this.http.post<Todo>(this.apiUrl, newTodo).pipe(timeout(5000));
  }

  toggleTodo(id: number, newCompleted: boolean): Observable<{ id: number; completed: boolean }> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      switchMap((todo) =>
        this.http.put<Todo>(`${this.apiUrl}/${id}`, {
          ...todo,
          completed: newCompleted,
        }),
      ),
      map((updated) => ({ id: updated.id, completed: updated.completed })),
      timeout(5000),
    );
  }

  updateTodoTitle(id: number, title: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`).pipe(
      switchMap((todo) =>
        this.http.put<Todo>(`${this.apiUrl}/${id}`, {
          ...todo,
          title,
        }),
      ),
      timeout(5000),
    );
  }

  deleteTodo(id: number): Observable<number> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => id),
      timeout(5000),
    );
  }
}
