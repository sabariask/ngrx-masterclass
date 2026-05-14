import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Analytics } from './analytics';
import { provideStore } from '@ngrx/store';
import { provideRouter } from '@angular/router';

describe('Analytics', () => {
  let component: Analytics;
  let fixture: ComponentFixture<Analytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Analytics],
      providers: [provideRouter([]), provideStore({})],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Analytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
