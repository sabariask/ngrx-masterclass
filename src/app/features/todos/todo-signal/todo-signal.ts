import { Component, inject, OnInit } from '@angular/core';
import { TodoSignalStore } from '../store/todo-signal.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo-signal',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-signal.html',
  styleUrl: './todo-signal.scss',
})
export class TodoSignal implements OnInit {
  protected store = inject(TodoSignalStore);
  newTitle = '';
  newPriority: 'low' | 'medium' | 'high' = 'medium';

  ngOnInit() {
    this.store.loadTodos();
  }

  addTodo() {
    if(!this.newTitle.trim()) return;
    this.store.addTodo({
      title: this.newTitle,
      priority: this.newPriority,
    });
    this.newTitle = '';
    this.newPriority = 'medium';
  }

  toggleTodo(todo: any) {
    this.store.toggleTodo({
      ...todo,
      completed: todo.completed,
    });
  }

  deleteTodo(id: number) {
    this.store.deleteTodo(id);
  }

  setFilter(filter: any) {
    this.store.setFilter(filter);
  }
}
