import { Component, OnInit } from '@angular/core';
import { Product } from '../../classes/product';
import { CartItem } from '../../classes/cart-item';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { Observable, of, Subscription } from 'rxjs';
import { WishlistService } from 'src/app/services/wishlist.service';
import { LoginService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { LoginNavService } from 'src/app/services/login-nav.service';
import { CommonUtils } from 'src/app/services/common-utils/common-utils';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  public cartItems          :   Observable<CartItem[]> = of([]);
  public shoppingCartItems  :   CartItem[] = [];
  get_user_dtls: any;
  userId: string;
  pageNo: number = 0;
  limit=12;
  cartlistapi: string;
  localstorage: boolean = true;
  pagination: boolean;
  private getCartlistSubscribe: Subscription;
  model:any = {};
  private setQtySubscribe: Subscription;
  setqtyapi: string;
  pageDisabled: boolean;
  total_price = 0;
  removefromCartSubscribe: Subscription;
  mulDelBtn: boolean;
  loader: boolean;
  noLoader: boolean;
  constructor(private productsService: ProductsService,
    private cartService: CartService,private wishlistService: WishlistService,
    private authService: LoginService,private toastrService:ToastrService,
    private http:HttpClient,private loginNav: LoginNavService,private commonUtils: CommonUtils,) { }

  ngOnInit() {
    this.mulDelBtn = true;
  	this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(shoppingCartItems => this.shoppingCartItems = shoppingCartItems);
    // this.total_price = 0
    // var getitemTotal = 0
    // var allcart:any = {};
    // allcart = this.shoppingCartItems;
    // console.log("allcart",allcart);
    
    // for(let i = 0;i < this.shoppingCartItems.length; i++)
    // {
    //   getitemTotal =  allcart[i].quantity *  allcart[i].product.price.indPrice.dealPrice
    //   this.total_price = this.total_price + getitemTotal;
    // }
    // console.log('shoppingCartItems', getitemTotal,this.total_price);
    this.getTotal();
    this.commonFunction();
    
  }
  //  commonFunction start
  commonFunction()
  {
    this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if (res != null || res != undefined) {
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        
        this.userId = this.get_user_dtls.uid
        this.model.quantity = 1;
        this.setqtyapi = "user/cart/update";
        this.cartlistapi = "user/cart/getUserCart?userId="+this.userId;
        // Call wish list data 
        this.getCartListData();
        this.localstorage = false;
      }
    });
  }
  // commonFunction end
  //  get wish list after login start
  getCartListData() {
    if(this.noLoader == true)
    {
      this.loader = false;
      this.noLoader = false;
    }else{
      this.loader = true;
    }
    // this.loader = true;
    this.getCartlistSubscribe = this.http.get(this.cartlistapi).subscribe(
      (response: any) => {
        this.loader = false;
        console.log('Cart list', response);
        this.shoppingCartItems = response;
        this.total_price = 0
        var getitemTotal = 0
        for(let i = 0;i < response.length; i++)
        {
          getitemTotal = response[i].cartData.qty * response[i].price.indPrice.dealPrice
          this.total_price = this.total_price + getitemTotal;
        }
        
        console.log("shoppingCartItems",this.shoppingCartItems,this.shoppingCartItems.length);
       
        // this.toastrService.success(response.message); 
        if(response.status == 200)
        {
          this.pageDisabled = false
          
        }else if(response.status == 400){
          // this.toastrService.error(response.message); 
          console.log("Error1");
          this.mulDelBtn = false;
        }
        this.pagination = true;
      },
      errRes => {
        this.toastrService.error(errRes.error.message); 
        // console.log("Error");
        this.pageDisabled = false
        this.loader = false;
      }
    );
  }
  //  get wish list after login end
  setQuantity(identifire,product,current_qty)
  { 
    console.log("product",product);
    
    this.pageDisabled = true;
    var qty;
    if(identifire == "increment")
    {
      qty = current_qty + 1;
    }
    else if(identifire == "decrement")
    {
      qty = current_qty - 1;
    }
    var data = {
      userId:this.get_user_dtls.uid,
      productId:product.productId,
      selectedSize:product.selectedSize,
      qty:qty
    }
     this.setQtySubscribe = this.http.put(this.setqtyapi,data).subscribe(
      (response: any) => {
       this.model.quantity = response.qty;
       this.pageDisabled = false;
       this.noLoader = true;
        this.getCartListData()
      },
      errRes => {
        this.toastrService.error(errRes.error.message); 
        this.pageDisabled = false;
        this.noLoader = true;
        this.getCartListData()
      }
    );
  }
  // Add to wishlist
  public addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
  }
  // Increase Product Quantity
  public increment(product: any, quantity: number = 1) {
    this.cartService.updateCartQuantity(product,quantity);
    this.getTotal()
  }
  
  // Decrease Product Quantity
  public decrement(product: any, quantity: number = -1) {
    this.cartService.updateCartQuantity(product,quantity);
    this.getTotal()
  }
  
  // Get Total
  // public getTotal(): Observable<number> {
  //   return this.cartService.getTotalAmount();
  // }
  
  // Remove cart items
  public removeItem(item: CartItem) {
    this.cartService.removeFromCart(item);
    this.noLoader = true;
    setTimeout(() => {
      this.getCartListData();
    }, 500);
    this.getTotal();
  }
  // getTotal start
  getTotal()
  {
    var allcart:any = {};
    this.total_price = 0
    var getitemTotal = 0;
    allcart = this.shoppingCartItems;
    
    for(let i = 0;i < this.shoppingCartItems.length; i++)
    {
      getitemTotal =  allcart[i].quantity *  allcart[i].product.price.indPrice.dealPrice
      this.total_price = this.total_price + getitemTotal;
    }
  }
  // getTotal end
  async askToClearcart() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-default'
      },
      buttonsStyling: true,
    });
    swalWithBootstrapButtons.fire(
    {
      showCloseButton: true,
      title: 'Delete',
      text: 'Are you went to Delete all cart items ?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: false
    }
    ).then((result) => {
      if (result.value) {
        this.removeAllcart();
        return;
      }
    });
  }
  public removeAllcart() {
    
   this.removefromCartSubscribe = this.http.delete('user/cart/multipleDelete/'+this.get_user_dtls.uid).subscribe(
        (response:any) => {
          console.log('response', response);
            // this.toastrService.success(response.message); 
            if(response.status == 400){
              let cart = []
              this.commonUtils.getCartDataService(cart);
            }else {
              this.commonUtils.getCartDataService(response);
            }
            this.getCartListData();
        },
        errRes => {
          
        });   
  }  
  openLoginNav()
  {
    // this.showScreen = 'login';
    this.loginNav.addNavLogin();
  }
  ngOnDestroy() {
    if (this.getCartlistSubscribe !== undefined) {
      this.getCartlistSubscribe.unsubscribe();
    }
  }
}
