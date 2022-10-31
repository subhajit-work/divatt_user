import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerListComponent } from './designer-list.component';

describe('DesignerListComponent', () => {
  let component: DesignerListComponent;
  let fixture: ComponentFixture<DesignerListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
