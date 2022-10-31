import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryCollectionBannerComponent } from './category-collection-banner.component';

describe('CategoryCollectionBannerComponent', () => {
  let component: CategoryCollectionBannerComponent;
  let fixture: ComponentFixture<CategoryCollectionBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryCollectionBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryCollectionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
