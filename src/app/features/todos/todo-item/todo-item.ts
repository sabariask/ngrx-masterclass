import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { Todo } from '../../../models/todo.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-todo-item',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItem {
  @Input() todo: Todo = {
    id: 0,
    title: '',
    completed: false,
    priority: 'low',
    createdAt: '',
    userId: 0
  };
  @Output() onToggle = new EventEmitter<Todo>();
  @Output() onDelete = new EventEmitter<number>();
  @Output() onUpdateTitle = new EventEmitter<{ id: number; title: string }>();

  isEditing = signal(false);
  editTitle = signal('');

  toggle(): void {
    this.onToggle.emit(this.todo);
  }

  delete(): void {
    this.onDelete.emit(this.todo.id);
  }

  startEdit() {
    this.isEditing.set(true);
    this.editTitle.set(this.todo.title);
  }

  saveEdit() {
    const newTitle = this.editTitle().trim();
    if (!newTitle) {
      this.cancelEdit();
      return;
    }

    if (newTitle === this.todo.title) {
      this.isEditing.set(false);
      return;
    }

    this.onUpdateTitle.emit({ id: this.todo.id, title: newTitle });
    this.isEditing.set(false);
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.editTitle.set('');
  }
}
