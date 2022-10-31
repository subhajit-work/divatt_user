import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { ProductsService } from '../services/products.service';
import { WishlistService } from '../services/wishlist.service';
import { CartService } from '../services/cart.service';
import { Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  
  @Input() product : any;
  public variantImage  :  any = ''; 
  public selectedItem  :  any = '';
  compareBtn: any;
  allcompareproduct;

  constructor(private router: Router, public productsService: ProductsService,private toastrService: ToastrService, 
    private wishlistService: WishlistService, private cartService: CartService) { 
  }

  ngOnInit() {  
    // this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));
  }

  // Add to cart
  public addToCart(product: Product,  quantity: number = 1) {
    this.cartService.addToCart(product,quantity);
  }

  // Add to compare
  public addToCompare(product: Product) {
    console.log(product);
    
     this.productsService.addToCompare(product);
     
    //  this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));
    
     
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
    console.log('product>>>>', product);
    
     this.wishlistService.addToWishlist(product);
  }
 
 // Change variant images
  public changeVariantImage(image) {
     this.variantImage = image;
     this.selectedItem = image; 
  }  
viewProduct(productId)
{
  console.log(productId);
  
  this.router.navigateByUrl('/product-detail/'+ productId);
}
}
