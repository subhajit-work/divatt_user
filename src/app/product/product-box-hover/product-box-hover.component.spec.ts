import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBoxHoverComponent } from './product-box-hover.component';

describe('ProductBoxHoverComponent', () => {
  let component: ProductBoxHoverComponent;
  let fixture: ComponentFixture<ProductBoxHoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBoxHoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBoxHoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
