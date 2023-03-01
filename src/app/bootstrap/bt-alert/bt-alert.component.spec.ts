import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtAlertComponent } from './bt-alert.component';

describe('BtAlertComponent', () => {
  let component: BtAlertComponent;
  let fixture: ComponentFixture<BtAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BtAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BtAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
