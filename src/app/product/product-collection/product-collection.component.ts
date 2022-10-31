
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { trigger, transition, style, animate, state } from "@angular/animations";
import { Product, ColorFilter, TagFilter } from '../../classes/product';
import { ProductsService } from '../../services/products.service';
import { LandingFixService } from '../../services/landing-fix.service';
import {HttpClient} from '@angular/common/http'
import * as _ from 'lodash'
import * as $ from 'jquery';
import { Filter } from 'src/app/widgets/filter/filter.model';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-collection',
  templateUrl: './product-collection.component.html',
  styleUrls: ['./product-collection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCollectionComponent implements OnInit {

  public products     :   Product[] = [];
  public items        :   Product[] = [];
  public allItems     :   Product[] = [];
  public colorFilters :   ColorFilter[] = [];
  public tagsFilters  :   any[] = [];
  public tags         :   any[] = [];
  public colors       :   any[] = [];
  public sortByOrder  :   string = '';   // sorting
  public animation    :   any;   // Animation
  public collection_title: string;
  public productfilter : Filter;
  public category : string;
  config: any; 
  collection = [];

  visiblefilter=false
  lastKey = ''      // key to offset next query from
  finished = false  // boolean when end of data is reached
  allproducts: Product[];
  errorMsg: any;
  api_url: string;
  private productDataSubscribe: Subscription;
  subcategory: any;
  xyz
  loader: boolean;
  constructor(private route: ActivatedRoute, 
    private toastrService: ToastrService,
    private router: Router,
    private productsService: ProductsService,
    private fix: LandingFixService,
    private activatedRoute : ActivatedRoute,
    private http:HttpClient,private wishlistService: WishlistService,) {
    
      this.route.params.subscribe(params => {
      //   this.xyz = params['subcategory'];
      //  this.collection_title = this.category;
      //  console.log("this.route",this.route.url);
       this.ngOnInit()
    },
    
    
    );

    //   this.productsService.getProductByCategory(this.category).subscribe(products => 
    //     this.allItems = products,  // all products
    //  )
    
      
  }
  ngOnInit() {
  	// this.productsService.getProducts().subscribe(product => this.products = product);
    
    // this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));
    // product get api
    this.category = this.activatedRoute.snapshot.params.category;
    this.subcategory = this.activatedRoute.snapshot.params.subcategory;
    console.log("URL",this.category,this.subcategory);
    
    this.commonFunction()
  }
  commonFunction()
  {
    
    // this.api_url = 'designerProduct/viewProductByCategorySubcategory/'+this.category+'/'+this.subcategory;
    this.getProductList();
        this.config = {
          currentPage: 1,
          itemsPerPage: 12
        };

this.route.queryParamMap
.map(params => params.get('page'))
.subscribe(page => this.config.currentPage = page);
  }
  getProductList()
  {
    this.loader = true;
 
    this.productDataSubscribe = this.http.get('designerProduct/viewProductByCategorySubcategory/'+this.category+'/'+this.subcategory).subscribe(
      (response:any) => {
        console.log("response",response);
        // this.products = response;
        this.allproducts = response;
        console.log("this.products",this.products);
        if(response.status === 200){
          this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
        this.loader = false;
      },
      errRes => {
        this.loader = false;
        console.log("error handeller >>@@",errRes );
        if(errRes.error.message){
          this.errorMsg = errRes.error.message;
        }else if(errRes.error.messagee){
          this.errorMsg = errRes.error.messagee;
        } else {
          // this.toastrService.error();
          this.errorMsg = errRes.message
        }
        this.toastrService.error(this.errorMsg);
      }
    );
  }
//   this.productsService.getProductByCategory(this.category).subscribe(
//     (res: any) => {
//       this.allItems = res; // all products
//       console.log("this.allItems",res);
      
//     },
    
//    (err: any) => {
//       console.log(err);
      
//    } 
    
//  );
//   ngOnInit() {
//     this.productsService.getProducts().subscribe(product => this.allproducts = product);
  

// console.log("calling for products")

 

//   this.config = {
//    currentPage: 1,
//    itemsPerPage: 12
// };

// this.route.queryParamMap
// .map(params => params.get('page'))
// .subscribe(page => this.config.currentPage = page);


//   }


  public pageChange(newPage: number) {
		this.router.navigate(['/collections/'+this.category+'/'+this.subcategory+'/'], { queryParams: { page: newPage } });
	}

public setFilter(event){
  this.productfilter = event


  this.products = this.allItems.filter(function(ele){
    return ele.price <= event.to_price && ele.price>=event.from_price
  })
}

  openNav() {
  	this.fix.addNavFix();
  }

  closeNav() {
     this.fix.removeNavFix();
  }
  // Get current product tags
  public getTags(products) {
     var uniqueBrands = []
     var itemBrand = Array();
     products.map((product, index) => {
        if(product.tags) {
           product.tags.map((tag) => {
           const index = uniqueBrands.indexOf(tag);
           if(index === -1)  uniqueBrands.push(tag);
        })
       }
     });
     for (var i = 0; i < uniqueBrands.length; i++) {
          itemBrand.push({brand:uniqueBrands[i]})
     }
     this.tags = itemBrand
    //  console.log('tags length' +this.tags.length)
  }

  // Get current product colors
  public getColors(products) {
     var uniqueColors = []
     var itemColor = Array();
     products.map((product, index) => {
       if(product.colors) {
       product.colors.map((color) => {
           const index = uniqueColors.indexOf(color);
           if(index === -1)  uniqueColors.push(color);
       })
      }
     });
     for (var i = 0; i < uniqueColors.length; i++) {
          itemColor.push({color:uniqueColors[i]})
     }
     this.colors = itemColor
  }


  // Animation Effect fadeIn
  public fadeIn() {
      this.animation = 'fadeIn';
  }

  // Animation Effect fadeOut
  public fadeOut() {
      this.animation = 'fadeOut';
  }


  // Initialize filetr Items
  public filterItems(): Product[] {
      return this.items.filter((item: Product) => {
          const Colors: boolean = this.colorFilters.reduce((prev, curr) => { // Match Color
            if(item.colors){
              if (item.colors.includes(curr.color)) {
                return prev && true;
              }
            }
          }, true);
          const Tags: boolean = this.tagsFilters.reduce((prev, curr) => { // Match Tags
            if(item.tags) {
              if (item.tags.includes(curr)) {
                return prev && true;
              }
            }
          }, true);
          return Colors && Tags; // return true
      });
  }

  // Update tags filter
  public updateTagFilters(tags: any[]) {
      this.tagsFilters = tags;
      this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
  }

  // Update color filter
  public updateColorFilters(colors: ColorFilter[]) {
      this.colorFilters = colors;
      this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
  }

  // Update price filter
  public updatePriceFilters(price: any) {
      let items: any[] = [];
      this.products.filter((item: Product) => {
          if (item.price >= price[0] && item.price <= price[1] )  {
             items.push(item); // push in array
          }
      });
      this.items = items;
  }

  public twoCol() {
    if ($('.product-wrapper-grid').hasClass("list-view")) {} else {
      $(".product-wrapper-grid").children().children().children().removeClass();
      $(".product-wrapper-grid").children().children().children().addClass("col-lg-6");
    }
  }

  public threeCol() {
    if ($('.product-wrapper-grid').hasClass("list-view")) {} else {
      $(".product-wrapper-grid").children().children().children().removeClass();
      $(".product-wrapper-grid").children().children().children().addClass("col-lg-4");
    }
  }

  public fourCol() {
    if ($('.product-wrapper-grid').hasClass("list-view")) {} else {
      $(".product-wrapper-grid").children().children().children().removeClass();
      $(".product-wrapper-grid").children().children().children().addClass("col-lg-3");
    }
  }

  public sixCol() {
    if ($('.product-wrapper-grid').hasClass("list-view")) {} else {
      $(".product-wrapper-grid").children().children().children().removeClass();
      $(".product-wrapper-grid").children().children().children().addClass("col-lg-2");
    }
  }

  // For mobile filter view
  public mobileFilter() {
    $('.collection-filter').css("left", "-15px");
  }

  // Infinite scroll
  public onScroll() {
      this.lastKey = _.last(this.allItems)['id'];
      if (this.lastKey != _.last(this.items)['id']) {
         this.finished = false
      }
      // If data is identical, stop making queries
      if (this.lastKey == _.last(this.items)['id']) {
         this.finished = true
      }
      if(this.products.length < this.allItems.length){
         let len = this.products.length;
         for(var i = len; i < len+4; i++){
           if(this.allItems[i] == undefined) return true
             this.products.push(this.allItems[i]);
         }
      }
  }

  // sorting type ASC / DESC / A-Z / Z-A etc.
  public onChangeSorting(val) {
     this.sortByOrder = val;
     this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
  }

  scrollToTop(){
    // window.scrollTo(0,0);
     //or document.body.scrollTop = 0;
     document.querySelector('body').scrollTo(0,0)
    console.log("window.scroll",window.scroll);
    
  }

  // toogle filter
  menuState:string = 'out';
  public toggleMenu() {
      // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
  public addToWishlist(product: Product) {
    this.wishlistService.addToWishlist(product);
 }
}
