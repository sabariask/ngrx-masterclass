import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoDetail } from './todo-detail';
import { provideStore } from '@ngrx/store';
import { todoReducer } from '../store/todo.reducer';
import { provideRouter } from '@angular/router';

describe('TodoDetail', () => {
  let component: TodoDetail;
  let fixture: ComponentFixture<TodoDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoDetail],
      providers: [provideStore({ todos: todoReducer }), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
