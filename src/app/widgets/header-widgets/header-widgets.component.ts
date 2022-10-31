import { Component, OnInit, Input, Inject } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { CartItem } from '../../classes/cart-item';
import { CartService } from '../../services/cart.service';
import { ProductsService } from '../../services/products.service';
import { Observable, of, Subscription } from 'rxjs';
import { WINDOW } from 'src/app/services/windows.service';
import { LoginNavService } from 'src/app/services/login-nav.service';
import { NgForm } from '@angular/forms';
import { LoginService } from 'src/app/services/auth/auth.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Product } from 'src/app/classes/product';
import { WishlistService } from 'src/app/services/wishlist.service';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular5-social-login';
declare var $: any;

@Component({
  selector: 'app-header-widgets',
  templateUrl: './header-widgets.component.html',
  styleUrls: ['./header-widgets.component.css']
})
export class HeaderWidgetsComponent implements OnInit {

  @Input() shoppingCartItems  :   CartItem[] = [];

  public show  :   boolean = false;
  hide = true;
  hide2 = true;
  hide3 = true;
  hideset = true;
  api_url;
  model: any = {};
  isLoading = false;
  errorMsg;
  get_user_dtls;
  private formSubmitSubscribe: Subscription;
  private logoutDataSubscribe : Subscription;
  private cartDataSubscribe: Subscription;
  private getCartlistSubscribe: Subscription;
  isLogin: boolean = false;
  userId: any;
  pageNo: number = 0;
  limit = 0;
  removefromWishlist: { productId: number; userId: any; };
  wishlistapi: string;
  getWishlistSubscribe: Subscription;

  constructor(private cartService: CartService,
    private authService:LoginService,
    private commonUtils: CommonUtils,
    private http : HttpClient,
    private toastrService: ToastrService,
    @Inject(WINDOW) private window,private loginNav: LoginNavService,
    private wishlistService: WishlistService,
   public productsService: ProductsService,public socialLogin:AuthService) { }

   

  ngOnInit() {
    console.log('shoppingCartItems', this.shoppingCartItems);
    
    this.api_url = 'auth/login';
    this.model = {
      registerType: 'manual',
      userType: 'USER' 
    }
    // this.commonFunction();
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        this.userId = this.get_user_dtls.uid;
        this.isLogin = true;
        this.commonUtils.onClicksigninCheck(res);
        // referesh cart list
        this.cartService.getCartListData();
      }else{this.isLogin = false;}
    });


    // cart list check start
    this.cartDataSubscribe = this.commonUtils.onChangeCartList.subscribe((res:any) => {
      console.log(' =========== Cart data  >>>>>>>>>>>', res);
      if(this.get_user_dtls) {
        this.shoppingCartItems = res;
      }
      
    });
    // cart list check end
    
  }
  user;authorized;
  public signInWithGoogle(socialPlatform): void {
    // this.socialLogin.signIn(GoogleLoginProvider.PROVIDER_ID);
    let socialPlatformProvider;
    if(socialPlatform == "facebook"){
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    }else if(socialPlatform == "google"){
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }
    
    this.socialLogin.signIn(socialPlatformProvider).then(
      (userData:any) => {
        console.log(socialPlatform+" sign in data : " , userData);
        // Now sign-in with userData        
        if (userData != null) {
               this.authorized = true;
               this.user = userData;   
               userData.type = "USER";
            }  
            var data =  {
              socialId: this.user.id,
              name: this.user.name,
              email: this.user.email,
              profilePic:this.user.image,
              socialType:this.user.provider,
              type:"USER",
              password:'1234'
          }
            // if(socialPlatform == 'facebook')
            // {
            //   console.log(this.user.email);
            // }
            this.authenticate('', data);     
      },(error)=>{
        console.log(error);
        
      }
    );
  }
  public signOut(){
    this.socialLogin.signOut();
    this.authorized = false;
}
  redirectFromForgotPsw = false;
  getMethodFor;
  showScreen:any = 'login';
  openLoginNav(_identifier) {
    console.log('openLoginNav');
    this.isLoading = false;
    this.errorMsg = '';
  	this.getMethodFor = _identifier;
    if(_identifier == 'login') {
      this.showScreen = 'login';
      this.model.socialType = "normal";
      this.loginNav.addNavLogin();
      this.api_url = 'auth/login';
      
    }else if(_identifier == 'register'){
      this.showScreen = 'register';
      this.loginNav.addNavLogin();
      this.loginNav.addNavRegister();
      this.api_url = 'user/add';
    }
    else if(_identifier == 'changepassword'){
      // this.loginNav.addNavLogin();
      // this.loginNav.addNavRegister();
      this.showScreen = 'changepassword';
      this.api_url = 'auth/changePassword';
      
      this.loginNav.addNavchangepassword();
    }
    else if(_identifier == 'forgotpassword'){
      this.showScreen = 'forgotpassword';
      // this.loginNav.addNavLogin();
      // this.loginNav.addNavRegister();
      this.api_url = 'auth/mailForgotPasswordLink'
      this.loginNav.addNavforgotpassword();
      this.redirectFromForgotPsw = true;
    }
  }

  closeLoginNav() {
     this.loginNav.removeNavLogin();
     this.showScreen = '';
     this.errorMsg = '';
  }

  public updateCurrency(curr) {
    this.productsService.currency = curr;
  }

  // public changeLanguage(lang){
  //   this.translate.use(lang)
  // }

  public openSearch() {
    this.show = true;
  }

  public closeSearch() {
    this.show = false;
  }

  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }

  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
  }

  // Logout user start
  logOutUser(){
    this.authService.logout();
  }
  
  // Date format change start
  dateFormatChange(_identifier, event: MatDatepickerInputEvent<Date>){
    console.log('_identifier', _identifier);
    console.log('_data', event);
    
    this.model.dob = moment(event.value).format('DD/MM/YYYY');
    console.log('this.model.dob ', this.model.dob );
    
  }

  //---------------- login form submit start-----------------
  onSubmitSingInForm(form:NgForm){
    console.log('form >>', form.value);
    if(!form.valid){
      return;
    }
    this.isLoading = true;
    this.authenticate(form, form.value);
    // form.reset();

  }

  // authenticate function
  authenticate(_form, form_data) {
    this.isLoading = true;
    let authObs: Observable<any>;
        authObs = this.authService.login(this.api_url, form_data, '')
        this.errorMsg = '';
        this.formSubmitSubscribe = authObs.subscribe(
          resData => {
            console.log('resData ============= (sign in) ))))))))))))))>', resData);
            if(resData.status === 200)
            {
              this.closeLoginNav();
              // Call wishlist
              let products = JSON.parse(localStorage.getItem("wishlistItem")) || [];
              let cartproducts = JSON.parse(localStorage.getItem("cartItem")) || [];
              console.log("products,cartproducts",products,cartproducts);
              
              if(products.length != 0)
              {
                this.addToWishlist(products);
              }
              if(cartproducts.length != 0)
              {
                this.addToCart(cartproducts);
              }
              
              console.log('Wishlist calling....',products);
              
              
              this.commonUtils.onClicksigninCheck(resData);

              // user details set
              this.commonUtils.onSigninUserInfo(resData);
              
              this.toastrService.success(resData.message);
              this.isLoading = false;
              _form.reset();
            }else{
              this.toastrService.error(resData.message);
              this.isLoading = false;
            }
            
          },
          errRes => {
            this.isLoading = false;
            console.log("error handeller >>@@",errRes );
            if(errRes.error.message){
              this.errorMsg = errRes.error.message;
            }else if(errRes.error.messagee){
              this.errorMsg = errRes.error.messagee;
            } else {
              this.toastrService.error(errRes.message);
            }
          }
        );
  }
// login form submit end

// Add to wishlist
public addToWishlist(product: Product) {
  console.log('product>>>>', product);
  
   this.wishlistService.addToWishlist(product);
}
// get wishlist
// public getWishlist(product: Product) {
  
//    this.wishlistService.getWishlist();
// }
// Add to cart
public addToCart(product: Product, quantity: number = 1) {
  console.log("cart calling..",product,this.userId);
  
  if (quantity > 0)
    this.cartService.addToCart(product, quantity);
  this.wishlistService.removeFromWishlist(product);
  
}
// =============== Forgot Password form submit start ==========
emaillinksent = false;
onSubmitForgotPassword(form:NgForm){
  this.emaillinksent = false;
  this.isLoading = true;
  this.errorMsg = '';
  console.log('form >>', form.value);
  // get form value
  let fd = new FormData();
  
  for (let val in form.value) {
    if(form.value[val] == undefined){
      form.value[val] = '';
    }
    fd.append(val, form.value[val]);

  };

  if(!form.valid){
    return;
  }

  this.formSubmitSubscribe = this.http.get(this.api_url+'/'+form.value.email).subscribe(
    (response:any) => {
      if(response.status === 200){
        this.toastrService.success(response.message);
        form.reset();
        this.isLoading = false;
        this.emaillinksent = true;
      }else {
        this.toastrService.error(response.message);
        this.isLoading = false;
      }
    },
    errRes => {
      this.isLoading = false;
      console.log("error handeller >>@@",errRes );
      if(errRes.error.message){
        this.errorMsg = errRes.error.message;
      }else if(errRes.error.messagee){
        this.errorMsg = errRes.error.messagee;
      } else {
        this.toastrService.error(errRes.message);
      }
    }
  );
}
// Forgot Password  form submit end

// =============== Change Password form submit start ==========
onSubmitChangePassword(form:NgForm){
  this.isLoading = true;
  this.errorMsg = '';
  console.log('form >>', form.value);
  // get form value
  let fd = new FormData();
  
  for (let val in form.value) {
    if(form.value[val] == undefined){
      form.value[val] = '';
    }
    fd.append(val, form.value[val]);

  };

  if(!form.valid){
    return;
  }

  this.formSubmitSubscribe = this.http.post(this.api_url, form.value).subscribe(
    (response:any) => {
      if(response.status === 200){
        this.toastrService.success(response.message);
        form.reset();
        this.closeLoginNav();
        this.isLoading = false;
      }else {
        this.toastrService.error(response.message);
        this.isLoading = false;
      }
    },
    errRes => {
      this.isLoading = false;
      console.log("error handeller >>@@",errRes );
      if(errRes.error.message){
        this.errorMsg = errRes.error.message;
      }else if(errRes.error.messagee){
        this.errorMsg = errRes.error.messagee;
      } else {
        this.toastrService.error(errRes.message);
      }
    }
  );
}
// Change Password  form submit end

// ======================== CreateAccount form submit start ===================
onSubmitCreateAccount(form:NgForm){
  this.isLoading = true;
  this.errorMsg = '';
  console.log('form >>', form.value);
  // get form value
  let fd = new FormData();
  
  for (let val in form.value) {
    if(form.value[val] == undefined){
      form.value[val] = '';
    }
    fd.append(val, form.value[val]);
  };

  if(!form.valid){
    return;
  }
  this.formSubmitSubscribe = this.http.post(this.api_url, form.value).subscribe(
    (response:any) => {
      console.log('response', response);
      
      if(response.status === 200){
        this.showScreen = false;
        this.isLoading = false;
        form.reset();
        this.closeLoginNav();
        this.toastrService.success('Registration successfully! Please check your mail for active your account');
        // Please check your mail for active your account
        
        this.openLoginNav('login');
        
      }else {
        this.toastrService.error(response.message);
        this.isLoading = false;
      }
    },
    errRes => {
      this.isLoading = false;
      console.log("error handeller >>@@",errRes );
      if(errRes.error.message){
        this.errorMsg = errRes.error.message;
      }else if(errRes.error.messagee){
        this.errorMsg = errRes.error.messagee;
      } else {
        this.toastrService.error(errRes.message);
      }
      
    }
  );

}
// CreateAccount form submit end
 // ----------- destroy unsubscription start ---------
 ngOnDestroy() {
  if (this.formSubmitSubscribe !== undefined) {
    this.formSubmitSubscribe.unsubscribe();
  }if (this.logoutDataSubscribe !== undefined) {
    this.logoutDataSubscribe.unsubscribe();
  }
}
// ----------- destroy unsubscription end ---------  
}
