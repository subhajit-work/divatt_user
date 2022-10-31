import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerCardComponent } from './designer-card.component';

describe('DesignerCardComponent', () => {
  let component: DesignerCardComponent;
  let fixture: ComponentFixture<DesignerCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
