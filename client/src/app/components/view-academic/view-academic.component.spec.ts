import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAcademicComponent } from './view-academic.component';

describe('ViewAcademicComponent', () => {
  let component: ViewAcademicComponent;
  let fixture: ComponentFixture<ViewAcademicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAcademicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAcademicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
