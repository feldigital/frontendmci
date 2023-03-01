import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovedadcelulaComponent } from './novedadcelula.component';

describe('NovedadcelulaComponent', () => {
  let component: NovedadcelulaComponent;
  let fixture: ComponentFixture<NovedadcelulaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NovedadcelulaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NovedadcelulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
