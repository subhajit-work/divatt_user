import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ProductBoxCompareComponent } from './product/product-box-compare/product-box-compare.component';
import { ProductLeftImageComponent } from './product/product-left-image/product-left-image.component';
import { ProductCollectionComponent } from './product/product-collection/product-collection.component';
import { WishlistComponent } from './product/wishlist/wishlist.component';
import { CartComponent } from './product/cart/cart.component';
import { CheckoutComponent } from './product/checkout/checkout.component';
import { SuccessComponent } from './product/success/success.component';
import { DesignerProfileComponent } from './designer-profile/designer-profile.component';
import { DesignerCardComponent } from './designer-profile/designer-card/designer-card.component';
import { OrderListComponent } from './product/order-list/order-list.component';
import { OrderItemDetailsComponent } from './product/order-item-details/order-item-details.component';
import { BillingAddressComponent } from './product/billing-address/billing-address.component';
import { SearchComponent } from './product/search/search.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './services/auth/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    component : HomeComponent,
    pathMatch: 'full' 
  },
  { path: 'home',
    component: HomeComponent
  },
  { path: 'search',
    component: SearchComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'forgetpassword/:link/:time',
    component: ForgetPasswordComponent
  },
  {
    path: 'product-compare',
    component: ProductBoxCompareComponent
    
  },
  {
    path: 'product-detail/:id',
    component: ProductLeftImageComponent
  },
  {
    path: 'collections/:category/:subcategory',
    component: ProductCollectionComponent
  },
  {
    path: 'designer/:id',
    component: DesignerProfileComponent
  },
  {
    path: 'designer-list/:type',
    component: DesignerCardComponent
  },
  {
    path: 'wishlist',
    component: WishlistComponent
  },
  {
    path: 'order-list',
    component: OrderListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-item-details/:orderid/:designerid/:productid',
    component: OrderItemDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout/:id',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'address/:type',
    component: BillingAddressComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'order-successfully/:orderId',
    component: SuccessComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', component : HomeComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {useHash: true, scrollPositionRestoration: 'enabled',preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
