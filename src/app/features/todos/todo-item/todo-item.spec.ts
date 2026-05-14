import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoItem } from './todo-item';
import { provideRouter } from '@angular/router';

describe('TodoItem', () => {
  let component: TodoItem;
  let fixture: ComponentFixture<TodoItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
