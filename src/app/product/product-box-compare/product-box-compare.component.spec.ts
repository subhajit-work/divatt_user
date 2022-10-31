import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBoxCompareComponent } from './product-box-compare.component';

describe('ProductBoxCompareComponent', () => {
  let component: ProductBoxCompareComponent;
  let fixture: ComponentFixture<ProductBoxCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBoxCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBoxCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
