import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoList } from './todo-list';
import { provideRouter } from '@angular/router';
import { todoReducer } from '../store/todo.reducer';
import { provideStore } from '@ngrx/store';

describe('TodoList', () => {
  let component: TodoList;
  let fixture: ComponentFixture<TodoList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoList],
      providers: [provideStore({ todos: todoReducer }), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
