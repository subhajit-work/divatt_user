import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallaxBannerComponent } from './parallax-banner.component';

describe('ParallaxBannerComponent', () => {
  let component: ParallaxBannerComponent;
  let fixture: ComponentFixture<ParallaxBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParallaxBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallaxBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
