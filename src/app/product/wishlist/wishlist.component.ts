import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../classes/product';
import { ProductsService } from '../../services/products.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Observable, of, Subscription } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService } from 'src/app/services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  public product: Observable<Product[]> = of([]);
  public wishlistItems: Product[] = [];
  variantImage: any;
  selectedItem: any;
  get_user_dtls;
  private getWishlistSubscribe: Subscription;
  pageNo: number = 0;
  wishlistapi;
  userId;
  limit=12;
  pagination: boolean=false;
  private deleteWishlistSubscribe: Subscription;
  wishlistdeleteapi: string;
  localstorage: boolean;
  continuebtns: boolean = false;
  nowishlistItem: boolean = false;
  pageDisabled: boolean;
  emptyWishlist: boolean = false;
  selectedColor: any=[];
  selectedSize: any=[];
  size: any;
  loader: boolean;
  color: any;

  constructor(private router: Router, private wishlistService: WishlistService,
    private http: HttpClient,
    private authService: LoginService,
    private productsService: ProductsService, private cartService: CartService,private toastrService:ToastrService) {
    this.product = this.wishlistService.getProducts();
    this.product.subscribe(products => this.wishlistItems = products);
  }

  ngOnInit() {
    console.log(' this.wishlistItems', this.wishlistItems);
    if(this.wishlistItems.length != 0)
    {
      this.continuebtns = true;
    }
    this.commonFunction();
  }

  // commonFunction start
  commonFunction() {
    this.wishlistdeleteapi = "user/wishlist/delete";
    this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if (res != null || res != undefined) {
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        this.localstorage = false;
        this.userId = this.get_user_dtls.uid
        this.wishlistapi = "user/wishlist/getUserWishist?userId="+this.userId+"&page="+this.pageNo+"&limit="+this.limit;
        // Call wish list data 
        this.getWishListData();
      }
      else{
        this.localstorage = true;
      }
    });
  }
  // commonFunction end
  setPage(page: number) {
    console.log("page", page);
    console.log("page");

    this.pageNo = page;
    this.wishlistapi = "user/wishlist/getUserWishist?userId="+this.userId+"&page="+this.pageNo+"&limit="+this.limit;
    // user/wishlist/getUserWishist?userId='+96+'&page='+0+'&limit='+10
    this.getWishListData();
    // this.onListDate( this.listing_url,this.pageNo, this.displayRecord,this.sortColumnName,this.filttertype,this.sortOrderName, this.searchTerm, this.profileStatus);
  }
  //  get wish list after login start
  getWishListData() {
    this.loader = true;
    this.getWishlistSubscribe = this.http.get(this.wishlistapi).subscribe(
      (response: any) => {
        console.log('Wish list', response);
        this.wishlistItems = response;
        this.pagination = true;
        this.pageDisabled = false;
        this.loader = false;
        if(!response.data.length){
          this.emptyWishlist = true;
          this.pagination = false;
        }else {
          this.emptyWishlist = false;
          this.pagination = true;
        }
      },
      errRes => {
        this.pageDisabled = false;
        this.loader = false;
        this.toastrService.error(errRes.message); 
      }
    );
  }
  //  get wish list after login end

  // Add to cart
  public addToCart(product: Product, quantity: number = 1) {
    console.log("product",product,this.userId);
    product.selectedSize = this.size;
    console.log("product",product,this.userId);

    if (quantity > 0)
      this.cartService.addToCart(product, quantity);
        this.wishlistService.removeFromWishlist(product);
        // this.getWishListData()
        this.authService.globalparamsData.subscribe(res => {
          console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
          if (res != null || res != undefined) {
            this.get_user_dtls = res.logininfo;
            console.log('this.get_user_dtls************', this.get_user_dtls);
            // user details set
            this.localstorage = false;
            this.userId = this.get_user_dtls.uid
            this.wishlistapi = "user/wishlist/getUserWishist?userId="+this.userId+"&page="+this.pageNo+"&limit="+this.limit;
            this.removeItem(product, this.userId);
            // Call wish list data 
            this.getWishListData();
            this.localstorage = false;
          }
          else{
            this.localstorage = true;
          }
        });
    this.selectedSize = [];
  }
  // Add to compare
  public addToCompare(product: Product) {
    console.log(product);

    this.productsService.addToCompare(product);

    //  this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));


  }
  // Remove from wishlist
  public removeItem(product: Product, userId) {
    if(this.get_user_dtls)
    {
      this.pageDisabled = true;
      console.log("IF_get_user_dtls");
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        body: {
          productId: product.productId,
          userId: userId
        }
      }
      
      this.deleteWishlistSubscribe = this.http.delete(this.wishlistdeleteapi,options).subscribe(
        (response: any) => {
          console.log('Wish list', response);
          this.wishlistItems = response;
          this.pagination = true;
          if(response.data.length == 0){
            this.emptyWishlist = true;
          }else {
            this.emptyWishlist = false;
          }
          // this.toastrService.success(response.message)
        },
        errRes => {
          this.toastrService.error(errRes.error.message)
        }
        
      );
      setTimeout(() => {
        this.getWishListData();
      }, 500);
      
    }else
    {
      this.wishlistService.removeFromWishlist(product);
      console.log("Else_removeFromWishlist");
    }
    console.log("product",product);
    
   
    // this.getWishListData();
  }
  public changeVariantImage(image) {
    this.variantImage = image;
    this.selectedItem = image;
  }
  // Change size variant
  public changeSizeVariant(variant,i) {
    this.selectedSize[i] = variant;
    this.size = this.selectedSize[i];
 }
 public changeColorVariant(variant,i) {
  this.selectedColor = variant;
  console.log(this.selectedColor);
  this.selectedColor[i] = variant;
    this.color = this.selectedColor[i];
  
}
  ngOnDestroy() {
    if (this.getWishlistSubscribe !== undefined) {
      this.getWishlistSubscribe.unsubscribe();
    }
  }
}
