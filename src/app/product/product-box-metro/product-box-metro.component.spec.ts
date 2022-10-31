import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBoxMetroComponent } from './product-box-metro.component';

describe('ProductBoxMetroComponent', () => {
  let component: ProductBoxMetroComponent;
  let fixture: ComponentFixture<ProductBoxMetroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBoxMetroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBoxMetroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
