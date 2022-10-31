import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../classes/product';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public products: Product[] = [];
  allcompareproduct: any;
  private productDataSubscribe: Subscription;
  api_url: string;
  errorMsg: any;
  public variantImage  :  any = ''; 
  public selectedItem  :  any = '';
  private designerListSubscribe: Subscription;
  
  constructor(private productsService: ProductsService,private http : HttpClient,
    private toastrService: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router) {   }

  ngOnInit() {
  	// this.productsService.getProducts().subscribe(product => this.products = product);
    
    // this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));
    // product get api
    
    this.commonFunction()
  }
  commonFunction()
  {
    this.api_url = 'user/product/list';
    this.getProductList();
    this.getDesignerList();
  }
  getProductList()
  {
    
 
    this.productDataSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        console.log("response",response);
        this.products = response;
        console.log("this.products",this.products);
        if(response.status === 200){
          this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
      },
      errRes => {
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
  public productSlideConfig: any = {
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: false,
    dots: true,
    autoplaySpeed: 3000,
    nextArrow:"<div class='nav-btn next-slide fa fa-angle-right'></div>",
    prevArrow:"<div class='nav-btn prev-slide fa fa-angle-left'></div>",
    responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
          dots:false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          dots:false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots:false,
        }
      },
      {
        breakpoint: 427,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows:false,
          dots:false,
        }
      }
    ]
  };
  public addToCompare(product: Product) {
    console.log(product);
    
     this.productsService.addToCompare(product);
     
     this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));   
     
  }
  // Change variant images
  public changeVariantImage(image) {
    this.variantImage = image;
    this.selectedItem = image; 
 }
 designerlist=[];
 getDesignerList()
  {
    this.designerlist=[];
    this.api_url = 'designer/getDesignerDetails/all';
    this.designerListSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        console.log("Designerlist",response);
        // this.designerlist = response;
        for (let index = 0; index < response.length; index++) {
          if(response[index].productCount > 0)
          {
            this.designerlist.push(response[index]);
          }
          
        }
        // if(response.)
        console.log("Designerlist",this.designerlist);
        if(response.status === 200){
          this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
        if(errRes.error.message){
          this.errorMsg = errRes.error.message;
        }else if(errRes.error.messagee){
          this.errorMsg = errRes.error.messagee;
        } else {
          this.errorMsg = errRes.message
        }
        this.toastrService.error(this.errorMsg);
      }
    );
  }
   // ----------- destroy unsubscription start ---------
   ngOnDestroy() {
    if (this.productDataSubscribe !== undefined) {
      this.productDataSubscribe.unsubscribe();
    }
    if (this.designerListSubscribe !== undefined) {
      this.designerListSubscribe.unsubscribe();
    }
    
  }
  // ----------- destroy unsubscription end ---------  
}
