import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBoxVerticalComponent } from './product-box-vertical.component';

describe('ProductBoxVerticalComponent', () => {
  let component: ProductBoxVerticalComponent;
  let fixture: ComponentFixture<ProductBoxVerticalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBoxVerticalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBoxVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
