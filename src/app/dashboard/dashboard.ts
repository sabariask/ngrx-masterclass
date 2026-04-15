import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Todo } from '../models/todo.model';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../services/user.service';
import { TodoService } from '../services/todo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements  OnInit, OnDestroy{
  user: User | null = null;
  todos: Todo[] = [];
  isLoading = false;
  errorMessage = '';

  private destory$ = new Subject<void>();
  private userService = inject(UserService);
  private todoService = inject(TodoService);

  ngOnInit(): void {
    this.isLoading = true;

    this.userService.getMockUser().pipe(
      takeUntil(this.destory$)
    ).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load user data';
        console.error('User Error:', err);
      }
    });

    this.todoService.getMockTodos().pipe(
      takeUntil(this.destory$)
    ).subscribe({
      next: (todos) => {
        this.todos = todos;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load todos';
        this.isLoading = false;
        console.error('Todo Error:', err);
      }
    });
  }

  get completedTodos(): Todo[] {
    return this.todos.filter(todo => todo.completed);
  }

  get pendingTodos(): Todo[] {
    return this.todos.filter(todo => !todo.completed);
  }

  get highPriorityTodos(): Todo[] {
    return this.todos.filter(todo => todo.priority === 'high' && !todo.completed);
  }

  ngOnDestroy(): void {
    this.destory$.next();
    this.destory$.complete();
  }
}
