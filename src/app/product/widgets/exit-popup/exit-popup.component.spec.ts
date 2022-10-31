import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitPopupComponent } from './exit-popup.component';

describe('ExitPopupComponent', () => {
  let component: ExitPopupComponent;
  let fixture: ComponentFixture<ExitPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
