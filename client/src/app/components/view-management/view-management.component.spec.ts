import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewManagementComponent } from './view-management.component';

describe('ViewManagementComponent', () => {
  let component: ViewManagementComponent;
  let fixture: ComponentFixture<ViewManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
