import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = 'http://localhost:3000/todos';
  private http = inject(HttpClient);

  getMockTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.apiUrl}`);
  }

  getTodoById(id: number = 1): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`);
  }

  addTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Observable<Todo> {
    const newTodo: Todo = {
      ...todo,
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
    };
    return this.http.post<Todo>(this.apiUrl, newTodo);
  }

  toggleTodo(id: number, newCompleted: boolean): Observable<{ id: number; completed: boolean }> {
    return this.http
      .get<Todo>(`${this.apiUrl}/${id}`)
      .pipe(map((todo) => ({ ...todo, completed: newCompleted })));
  }

  deleteTodo(id: number): Observable<number> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(map(() => id));
  }
}