import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { LoginService } from './auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonUtils } from './common-utils/common-utils';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("cartItem")) || [];

@Injectable({
  providedIn: 'root'
})

export class CartService {
  
  // Array
  public cartItems  :  BehaviorSubject<CartItem[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;
  get_user_dtls: any;
  addToCartlistSubscribe: Subscription;
  removefromCartSubscribe: Subscription;
  removeItem;
  pageNo: number = 0;
  limit=12;
  cartlistapi: string;
  getCartlistSubscribe: Subscription;
  shoppingCartItems: any;
  
  constructor(private toastrService: ToastrService,private authService:LoginService,
    private commonUtils: CommonUtils,
    private http:HttpClient,private router : Router) { 
      this.cartItems.subscribe(products => products = products);
      this.authService.globalparamsData.subscribe(res => {
        console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
        if(res != null || res != undefined){
          this.get_user_dtls = res.logininfo;
          console.log('this.get_user_dtls************', this.get_user_dtls);
          // user details set
          this.getCartListData();
        }
      });
  }
  
  // Get Products
  public getItems(): Observable<CartItem[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<CartItem[]>>itemsStream;
  }
 
  
  // Add to cart
  selectedSize
  public addToCart(product: Product, quantity: number): CartItem | boolean {
    console.log("get_user_dtls",this.get_user_dtls);
    console.log("Products",products);
    console.log("product",product);
    
    if(this.get_user_dtls)
    {
      console.log("product",product);
      console.log("get_user_dtls",this.get_user_dtls);
      var data = [];
      if(products.length > 0){
        for (let index = 0; index < products.length; index++) {
          console.log("products-if",products[index].product.productId);
          
          data.push({
            productId: products[index].product.productId,
            selectedSize:products[index].product.selectedSize,
            userId: this.get_user_dtls.uid,
            qty:1
          });
          console.log("data",data);
          
        }
        // start 
        
      }else {
        
        console.log("products-else",products);
        data.push({
          productId: product.productId,
          selectedSize:product.selectedSize,
          userId: this.get_user_dtls.uid,
          qty:1
        });
      }
      console.log('data >>>', data);
      this.addToCartlistSubscribe = this.http.post('user/cart/add',data).subscribe(
        (response:any) => {
          console.log('response', response);
          if(response.status == 200){
            this.toastrService.success(response.message); // toasr services
            this.getCartListData();
            localStorage.removeItem('cartItem');
            products = [];
          }else {
            this.toastrService.error(response.message); // toasr services
            this.getCartListData();
          }
          localStorage.removeItem('cartItem');
        },
        errRes => {
          this.toastrService.success(errRes.error.message); // toasr services
          this.getCartListData();
        });
      
    }
    else{
      console.log("get_user_dtls",this.get_user_dtls);
      var item: CartItem | boolean = false;
      // If Products exist
      let hasItem = products.find((items, index) => {
        console.log('Cart itemsOKK', items,products,product);
        items.selectedSize = product.selectedSize;
        console.log('Cart itemsOKK', items);
        // localStorage.removeItem('wishlistItem');
        if(items.product.productId == product.productId) {
          let qty = products[index].quantity + quantity;
          let stock = this.calculateStockCounts(products[index], quantity);
          if (qty != 0 && stock) {
            products[index]['quantity'] = qty;
            this.toastrService.success('Cart added succesfully');
          }
          return true;
        }
      });
      // If Products does not exist (Add New Products)
      if(!hasItem) {
          item = { product: product, selectedSize:this.selectedSize, quantity: quantity };
          products.push(item);
          this.toastrService.success('Cart added succesfully');
      }
  
      localStorage.setItem("cartItem", JSON.stringify(products));
      // localStorage.removeItem('wishlistItem');
      // // products = [];
      // this.router.navigateByUrl('cart');
      
      return item;
    }
   
  }
  
  // Update Cart Value
  public updateCartQuantity(product: Product, quantity: number): CartItem | boolean {
    return products.find((items, index) => {
      if(items.product.productId == product.productId) {
       let qty = products[index].quantity + quantity;
        let stock = this.calculateStockCounts(products[index], quantity);
        if (qty != 0 && stock) 
          products[index]['quantity'] = qty;
        localStorage.setItem("cartItem", JSON.stringify(products));
        return true;
      }
    });
  }
  
  // Calculate Product stock Counts
  public calculateStockCounts(product: CartItem, quantity): CartItem | Boolean {
    let qty   = product.quantity + quantity;
    let stock = product.product.stock;
    if(stock < qty) {
      this.toastrService.error('You can not add more items than available. In stock '+ stock +' items.');
      return false
    }
    return true
  }
  // Removed in cart
  public removeFromCart(item: CartItem) {
    console.log("item",item);
    this.removeItem = item;
    if(this.get_user_dtls)
    {
      const data = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: {
          id: this.removeItem.cartData.id,
          userId: this.get_user_dtls.uid
        }
      }
      this.removefromCartSubscribe = this.http.delete('user/cart/delete',data).subscribe(
        (response:any) => {
          console.log('response', response);
          if(response.status == 200){
            this.toastrService.success(response.message); // toasr services
            this.getCartListData();
          }else {
            this.toastrService.error(response.message); // toasr services
          }
        },
        errRes => {
          this.toastrService.error(errRes.error.message); // toasr services
        });
    }else{
      if (item === undefined) return false; 
      const index = products.indexOf(item);
      products.splice(index, 1);
      localStorage.setItem("cartItem", JSON.stringify(products));
    }
   
  }
  // Total amount 
  public getTotalAmount(): Observable<number> {
    return this.cartItems.pipe(map((product: CartItem[]) => {
      return products.reduce((prev, curr: CartItem) => {
        // return prev + curr.product.price * curr.quantity;
      }, 0);
    }));
  }

  // Cart List
  public getCartListData() {
    console.log("getCartListData",this.cartlistapi);
    this.cartlistapi = "user/cart/getUserCart?userId="+this.get_user_dtls.uid+"&page=0&limit=0";
    this.getCartlistSubscribe = this.http.get(this.cartlistapi).subscribe(
      (response: any) => {
        console.log('Cart list-----', response);
        if(response.status == 400){
          let cart = []
          this.commonUtils.getCartDataService(cart);
        }else {
          this.commonUtils.getCartDataService(response);
        }
       
      },
      errRes => {
        this.toastrService.error(errRes.error.message); 
      }
    );
  }


}