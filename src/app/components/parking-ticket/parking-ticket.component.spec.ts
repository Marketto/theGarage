import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingTicketComponent } from './parking-ticket.component';

describe('ParkingTicketComponent', () => {
  let component: ParkingTicketComponent;
  let fixture: ComponentFixture<ParkingTicketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkingTicketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkingTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
