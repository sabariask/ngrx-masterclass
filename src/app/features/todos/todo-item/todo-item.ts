import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Todo } from '../../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem implements OnInit {
  @Input() todo!: Todo;
  @Output() onToggle = new EventEmitter<Todo>();
  @Output() onDelete = new EventEmitter<number>();

  ngOnInit(): void {
    // this.todo = {
    //   id: 0,
    //   title: 'Test',
    //   description: 'test description',
    //   completed: true,
    //   priority: 'low',
    //   createdAt: new Date().toISOString(),
    //   userId: 0,
    //   dueDate: new Date().toISOString()
    // }
  }

  toggle(): void {
    this.onToggle.emit(this.todo);
  }

  delete(): void {
    this.onDelete.emit(this.todo.id);
  }
}
