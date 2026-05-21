import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoSignal } from './todo-signal';

describe('TodoSignal', () => {
  let component: TodoSignal;
  let fixture: ComponentFixture<TodoSignal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoSignal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodoSignal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
