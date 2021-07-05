import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphBehaviourComponent } from './graph-behaviour.component';

describe('GraphBehaviourComponent', () => {
  let component: GraphBehaviourComponent;
  let fixture: ComponentFixture<GraphBehaviourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphBehaviourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphBehaviourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
