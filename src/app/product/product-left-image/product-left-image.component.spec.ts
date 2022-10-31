import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductLeftImageComponent } from './product-left-image.component';

describe('ProductLeftImageComponent', () => {
  let component: ProductLeftImageComponent;
  let fixture: ComponentFixture<ProductLeftImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductLeftImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLeftImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
