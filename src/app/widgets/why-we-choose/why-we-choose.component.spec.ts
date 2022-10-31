import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyWeChooseComponent } from './why-we-choose.component';

describe('WhyWeChooseComponent', () => {
  let component: WhyWeChooseComponent;
  let fixture: ComponentFixture<WhyWeChooseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyWeChooseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyWeChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
