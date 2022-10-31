import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCartComponent } from './modal-cart.component';

describe('ModalCartComponent', () => {
  let component: ModalCartComponent;
  let fixture: ComponentFixture<ModalCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
