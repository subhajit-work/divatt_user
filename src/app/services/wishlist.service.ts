import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../classes/product';
import { BehaviorSubject, Observable, Subscriber, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { LoginService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';

// Get product from Localstorage
let products = JSON.parse(localStorage.getItem("wishlistItem")) || [];
@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  
  // wishlist array
  public wishlistProducts: BehaviorSubject<Product[]> = new BehaviorSubject([]);
  public observer   :  Subscriber<{}>;
  get_user_dtls;
  private addToWishlistSubscribe: Subscription;

  // Initialize 
  constructor(
    private toastrService: ToastrService,
    private authService:LoginService,
    private http:HttpClient,
    ) { 
    this.wishlistProducts.subscribe(products => products = products);

    this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
      }
    });
  }

  // Get  wishlist Products
  public getProducts(): Observable<Product[]> {
    const itemsStream = new Observable(observer => {
      observer.next(products);
      observer.complete();
    });
    return <Observable<Product[]>>itemsStream;
  }

  // If item is aleready added In wishlist
  public hasProduct(product: Product): boolean {
    const item = products.find(item => item.productId === product.productId);
    return item !== undefined;
  }

  // Add to wishlist
  public addToWishlist(product: Product): Product | boolean {
    console.log('product>>>>', product);
    console.log('products<<<>>>>', products);

    if(this.get_user_dtls) {
      var data = [];
      if(products.length > 0){
        for (let index = 0; index < products.length; index++) {
          
          data.push({
            productId: products[index].productId,
            userId: this.get_user_dtls.uid,
          });
        }
      }else {
        data.push({
          productId: product.productId,
          userId: this.get_user_dtls.uid,
        });
      }
      console.log('data >>>', data);
      
      // start 
      this.addToWishlistSubscribe = this.http.post('user/wishlist/add',data).subscribe(
        (response:any) => {
          console.log('response', response);
          if(response.status == 200){
            this.toastrService.success(response.message); // toasr services
            localStorage.removeItem('wishlistItem');

            products = [];
          }else {
            this.toastrService.error(response.message); // toasr services
          }
        },
        errRes => {
          this.toastrService.success(errRes.error.message); // toasr services
        });
      
    }else {
      var item: Product | boolean = false;
      if (this.hasProduct(product)) {
        item = products.filter(item => item.productId === product.productId)[0];
        const index = products.indexOf(item);
        this.toastrService.success('This product is already in Wishlist.');

      } else {
        console.log('condition else>>');
        products.push(product);

        this.toastrService.success('Wishlist added succesfully.'); // toasr services
        localStorage.setItem("wishlistItem", JSON.stringify(products));
      }
        

        console.log('wishlistItem', JSON.parse(localStorage.getItem('wishlistItem')));

        console.log('products', products);
        
        return item;
    }
    
    
  }
  // Removed Product
  public removeFromWishlist(product: Product) {
    console.log("TEST");
    
    if (product === undefined) { return; }
    const index = products.indexOf(product);
    products.splice(index, 1);
    localStorage.setItem("wishlistItem", JSON.stringify(products));
  }
  

}
