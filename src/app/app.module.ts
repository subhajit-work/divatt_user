import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, PathLocationStrategy } from '@angular/common';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRippleModule} from '@angular/material/core';
// import { SlickCarouselModule } from 'ngx-slick-carousel';
import { IsotopeModule } from 'ngx-isotope';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { BarRatingModule } from "ngx-bar-rating";
import { RangeSliderModule  } from 'ngx-rangeslider-component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// import { NgxPayPalModule } from 'ngx-paypal';
import { NgxImgZoomModule } from 'ngx-img-zoom';
import {NgxPaginationModule} from 'ngx-pagination';
// import { rootRouterConfig } from './app.routes';

import { AppRoutingModule } from './app-routing.module';
// npms installed
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {MatRadioModule} from '@angular/material/radio';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './widgets/topbar/topbar.component';
import { LeftMenuComponent } from './widgets/left-menu/left-menu.component';
import { NavbarComponent } from './widgets/navbar/navbar.component';
import { HeaderWidgetsComponent } from './widgets/header-widgets/header-widgets.component';
import { CategoriesComponent } from './widgets/categories/categories.component';
import { CopyrightComponent } from './widgets/copyright/copyright.component';
import { InformationComponent } from './widgets/information/information.component';
import { SocialComponent } from './widgets/social/social.component';
import { WhyWeChooseComponent } from './widgets/why-we-choose/why-we-choose.component';
import { SliderComponent } from './home/slider/slider.component';
import { CategoryCollectionBannerComponent } from './home/category-collection-banner/category-collection-banner.component';
import { ProductTabComponent } from './home/product-tab/product-tab.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './product/cart/cart.component';
import { CheckoutComponent } from './product/checkout/checkout.component';
import { ProductBoxComponent } from './product/product-box/product-box.component';
import { ProductBoxHoverComponent } from './product/product-box-hover/product-box-hover.component';
import { ProductBoxMetroComponent } from './product/product-box-metro/product-box-metro.component';
import { ProductBoxVerticalComponent } from './product/product-box-vertical/product-box-vertical.component';
import { ProductBoxCompareComponent } from './product/product-box-compare/product-box-compare.component';
import { SearchComponent } from './product/search/search.component';
import { ParallaxBannerComponent } from './home/parallax-banner/parallax-banner.component';
import { ProductSliderComponent } from './home/product-slider/product-slider.component';
import { ServicesComponent } from './home/services/services.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ProductLeftImageComponent } from './product/product-left-image/product-left-image.component';
import { RelatedProductsComponent } from './product/related-products/related-products.component';
import { ProductCollectionComponent } from './product/product-collection/product-collection.component';
import { CategoryComponent } from './product/widgets/category/category.component';
import { ExitPopupComponent } from './product/widgets/exit-popup/exit-popup.component';
import { ModalCartComponent } from './product/widgets/modal-cart/modal-cart.component';
import { NewProductComponent } from './product/widgets/new-product/new-product.component';
import { NewsletterComponent } from './product/widgets/newsletter/newsletter.component';
import { QuickViewComponent } from './product/widgets/quick-view/quick-view.component';
import { BrandComponent } from './product/product-collection/filter/brand/brand.component';
import { ColorComponent } from './product/product-collection/filter/color/color.component';
import { PriceComponent } from './product/product-collection/filter/price/price.component';

// Services
import { WINDOW_PROVIDERS } from "./services/windows.service";
import { LandingFixService } from './services/landing-fix.service';
import { InstagramService } from "./services/instagram.service";
import { ProductsService } from "./services/products.service";
import { WishlistService } from "./services/wishlist.service";
import { CartService } from "./services/cart.service";
import { OrderService } from "./services/order.service";
import { PaginationService } from "./classes/paginate";
import {HomeService} from "./services/home.service"
// Pipes
import { OrderByPipe } from './pipes/order-by.pipe';
import { SuccessComponent } from './product/success/success.component';
import { WishlistComponent } from './product/wishlist/wishlist.component';
import { DesignerProfileComponent } from './designer-profile/designer-profile.component';
import { FilterComponent } from './widgets/filter/filter.component';

//primeng/material components
import {SidebarModule} from 'primeng/sidebar';
import {MatExpansionModule} from '@angular/material/expansion';
import {SliderModule} from 'primeng/slider';
import {SelectButtonModule} from 'primeng/selectbutton';
import {MatTabsModule} from '@angular/material/tabs';
import {CarouselModule} from 'primeng/carousel';
//ngrx store
import { StoreModule } from '@ngrx/store';
import { FilterReducer } from './store/reducer/filter.reducer';
import { DesignerListComponent } from './designer-list/designer-list.component';
import { DesignerCardComponent } from './designer-profile/designer-card/designer-card.component';
import { OrderListComponent } from './product/order-list/order-list.component';
import { OrderItemDetailsComponent } from './product/order-item-details/order-item-details.component';
import { BillingAddressComponent } from './product/billing-address/billing-address.component';
import { InterceptorProvider } from './services/interceptors/interceptor';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MustMatchDirective } from './directives/must-match.directive';
import { ProfileComponent } from './profile/profile.component';
// import { NgSelectModule } from '@ng-select/ng-select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Base64Pipe } from './pipe/base64.pipe';
import { OnlyNumberDirective } from './directives/only-number.directive';
import { FileSizePipeConvertPipe } from './pipe/fileSize-convert.pipe ';
import { RoundPipe } from './pipe/roundof.pipe ';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from "angular5-social-login";
import { environment } from 'src/environments/environment';
import {MatButtonModule} from '@angular/material/button';
const routes: Routes = [
  { path: '', component: AppComponent },
];
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig(
      [
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider("2577899725685708")
        },
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          // provider: new GoogleLoginProvider("1016994148249-cvijokf575kprvsj6899n1ms5a213uu4.apps.googleusercontent.com")
          provider: new GoogleLoginProvider("915204620855-r72aoaots0g33irje15b8g5fvan9a65t.apps.googleusercontent.com")
        },
      ]
  );
  return config;
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    TopbarComponent,
    LeftMenuComponent,
    NavbarComponent,
    HeaderWidgetsComponent,
    OrderByPipe,
    CategoriesComponent,
    CopyrightComponent,
    InformationComponent,
    SocialComponent,
    WhyWeChooseComponent,
    SliderComponent,
    CategoryCollectionBannerComponent,
    ProductTabComponent,
    ProductComponent,
    CartComponent,
    CheckoutComponent,
    ProductBoxComponent,
    ProductBoxHoverComponent,
    ProductBoxMetroComponent,
    ProductBoxVerticalComponent,
    ProductBoxCompareComponent,
    SearchComponent,
    ParallaxBannerComponent,
    ProductSliderComponent,
    ServicesComponent,
    LoginComponent,
    RegisterComponent,
    ForgetPasswordComponent,
    ProductLeftImageComponent,
    RelatedProductsComponent,
    ProductCollectionComponent,
    CategoryComponent,
    ExitPopupComponent,
    ModalCartComponent,
    NewProductComponent,
    NewsletterComponent,
    QuickViewComponent,
    BrandComponent,
    ColorComponent,
    PriceComponent,
    SuccessComponent,
    WishlistComponent,
    DesignerProfileComponent,
    FilterComponent,
    DesignerListComponent,
    DesignerCardComponent,
    OrderListComponent,
    OrderItemDetailsComponent,
    BillingAddressComponent,
    MustMatchDirective,
    ProfileComponent,
    Base64Pipe,
    OnlyNumberDirective,
    FileSizePipeConvertPipe,
    RoundPipe,
  ],
  imports: [
    BrowserModule,
    // NgSelectModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    SidebarModule,
    SelectButtonModule,
    MatTabsModule,
    CarouselModule,
    MatExpansionModule,
    MatRadioModule,
    MatMenuModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatRippleModule,
    MatIconModule,
    MatSelectModule,
    NgbModule,ToastrModule.forRoot({
      timeOut: 2000,
      progressBar: false,
      enableHtml: true,
    }),
    SlickCarouselModule,
    IsotopeModule,
    BarRatingModule,
    RangeSliderModule,
    SliderModule,
    InfiniteScrollModule,
    NgxImgZoomModule,
    NgxPaginationModule,
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    StoreModule.forRoot({
      filter : FilterReducer
      }),
      SocialLoginModule,
      MatButtonModule
    // RouterModule.forRoot(rootRouterConfig, { useHash: false, anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
  ],
  providers: [
    WINDOW_PROVIDERS,
    LandingFixService,
    InstagramService,
    ProductsService,
    WishlistService,
    CartService,
    OrderService,
    PaginationService,
    HomeService,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    // {provide: LocationStrategy, useClass: HashLocationStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorProvider,
      multi: true
    },
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
