import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderWidgetsComponent } from './header-widgets.component';

describe('HeaderWidgetsComponent', () => {
  let component: HeaderWidgetsComponent;
  let fixture: ComponentFixture<HeaderWidgetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderWidgetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
