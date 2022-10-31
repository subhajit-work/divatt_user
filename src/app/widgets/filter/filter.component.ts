import { ChangeDetectionStrategy, Component, OnInit ,Output , EventEmitter} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { trigger, transition, style, animate, state } from "@angular/animations";
import { LandingFixService } from '../../services/landing-fix.service';
import { Product, ColorFilter, TagFilter } from '../../classes/product';
import { ProductsService } from '../../services/products.service';

import * as _ from 'lodash'
import * as $ from 'jquery';
import { Filter } from './filter.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [  // angular animation
    trigger('Animation', [
      transition('* => fadeOut', [
        style({ opacity: 0.1 }),
        animate(1000, style({ opacity: 0.1 }))
      ]),
      transition('* => fadeIn', [
         style({ opacity: 0.1 }),
         animate(1000, style({ opacity: 0.1 }))
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({
        transform: 'translate3d(0, 0, 0)'
      })),
      state('out', style({
        transform: 'translate3d(100%, 0, 0)'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ]),
  ]
})


export class FilterComponent implements OnInit {


  public products     :   Product[] = [];
  public items        :   Product[] = [];
  public allItems     :   Product[] = [];
  public colorFilters :   ColorFilter[] = [];
  public tagsFilters  :   any[] = [];
  public tags         :   any[] = [];
  public colors       :   any[] = [];
  public sortByOrder  :   string = '';   // sorting
  public animation    :   any;   // Animation

  public filter : Filter ;

  lastKey = ''      // key to offset next query from
  finished = false  // boolean when end of data is reached
  designerListSubscribe: any;

  constructor(private fix: LandingFixService,private productsService: ProductsService,private http:HttpClient,
    private toastrService: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router) {
    const category = "men";
    console.log("category" +category)
    this.productsService.getProductByCategory(category).subscribe(products => {
       this.allItems = products  // all products
       this.products = products.slice(0,8)
       this.getTags(products)
       this.getColors(products)
    });
  }

  ngOnInit() {
    $.getScript('assets/js/menu.js');
    this.filter = new Filter()
    this.designerlist();
  }

  @Output() 
  productfilter = new EventEmitter<Filter>();

 


 
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

  this.filter.from_price = price[0];
  this.filter.to_price = price[1];
    //  let items: any[] = [];
    //  this.allItems.filter((item: Product) => {
    //      if (item.price >= price[0] && item.price <= price[1] )  {
    //         items.push(item); // push in array
    //      }
    //  });
    //  this.items = items;
    // console.log(price)
     return this.productfilter.emit(this.filter);
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



//  // toogle filter
//  menuState:string = 'out';
//  public toggleMenu() {
//      // 1-line if statement that toggles the value:
//    this.menuState = this.menuState === 'out' ? 'in' : 'out';
//  }

  openNav() {
  	this.fix.addNavFix();
  }

  closeNav() {
     this.fix.removeNavFix();
  }
  // Animation Effect fadeIn
  public fadeIn() {
    this.animation = 'fadeIn';
}

  // Animation Effect fadeOut
  public fadeOut() {
      this.animation = 'fadeOut';
  }
  api_url = 'user/designer/list';
  designers;
  public designerlist()
  {
    this.designerListSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        console.log("response",response);
        this.designers = response;
        console.log("Designerlist",this.designerlist);
        if(response.status === 200){
          // this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
      },
      errRes => {
      }
    );
  }
  // sorting type ASC / DESC / A-Z / Z-A etc.
//   public onChangeSorting(val) {
//     // this.sortByOrder = val;
//     this.animation == 'fadeOut' ? this.fadeIn() : this.fadeOut(); // animation
//  }

  // toogle filter
  menuState:string = 'out';
  public toggleMenu() {
      // 1-line if statement that toggles the value:
    this.menuState = this.menuState === 'out' ? 'in' : 'out';
  }
}
