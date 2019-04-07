import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGarageComponent } from './leave-garage.component';

describe('LeaveGarageComponent', () => {
  let component: LeaveGarageComponent;
  let fixture: ComponentFixture<LeaveGarageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaveGarageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveGarageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
