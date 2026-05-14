import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Counter } from './counter';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { counterReducer } from '../counter/store/counter.reducer';

describe('Counter', () => {
  let component: Counter;
  let fixture: ComponentFixture<Counter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Counter],
      providers: [provideRouter([]), provideStore({ counter: counterReducer })],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Counter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
