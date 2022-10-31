import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ColorFilter, Product } from '../classes/product';
import { LoginService } from '../services/auth/auth.service';
import { ProductsService } from '../services/products.service';
import { Filter } from '../widgets/filter/filter.model';
@Component({
  selector: 'app-designer-profile',
  templateUrl: './designer-profile.component.html',
  styleUrls: ['./designer-profile.component.css']
})
export class DesignerProfileComponent implements OnInit {

  public products: Product[] = [];
  private getDesignerSubscribe: Subscription;
  private getProductSubscribe: Subscription;
  private designerFollowSubscribe: Subscription;
  designer: any={};
  errorMsg: any;
  api_url: string;
  parms_action_id: string;
  productlist: any;
  productapi_url: string;
  noproducts: boolean = false;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  userdata: any;
  followapi_url: string;
  get_user_dtls: any;
  getUserDetailsList_api: string;
  private getUserDetailss: Subscription;
  model: any={};
  private logoutDataSubscribe: Subscription;
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
  constructor(private http:HttpClient,
    private route: ActivatedRoute, 
    private toastrService: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router,private modalService: NgbModal,
    private authService:LoginService,) {   }

  ngOnInit() {
  	// this.productsService.getProducts().subscribe(product => this.products = product);
    this.commonFunction();
  }
  // commonFunction start
  commonFunction()
  {
    this.parms_action_id = this.activatedRoute.snapshot.paramMap.get('id');
    this.api_url = 'user/designerProfile';
    this.productapi_url = 'designerProduct/UserDesignerProductList';
    this.followapi_url = 'user/followDesigner';
    this.config = {
      currentPage: 1,
      itemsPerPage: 6
    };
    this.route.queryParamMap
    .map(params => params.get('page'))
    .subscribe(page => this.config.currentPage = page);
    this.getDesignerById();
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        this.getUserDetailsList_api = 'auth/info/'+ this.get_user_dtls.authority+'/'+this.get_user_dtls.email;
        this.getUserDetailsList();
      }
    });


   
  }
  // commonFunction end 
  getUserDetailsList(){
    this.getUserDetailss = this.http.get(this.getUserDetailsList_api).subscribe(
        (res:any) => {
          this.userdata = res;
          console.log("User Data",res,this.userdata);
          
        },
        errRes => {
           console.log("Get moduleList >", errRes); 
        }
      );
  }
   // getDesignerList start
   getDesignerById()
   {
     this.getDesignerSubscribe = this.http.get(this.api_url+'/'+this.parms_action_id).subscribe(
       (response:any) => {
         this.designer = response;
        //  console.log("Designer",this.designer.UserDesigner.length);
         if(response.status === 200){
          //  this.toastrService.success(response.message);
           
         }
         
         this.getDesignerProducts(this.designer.designerProfileEntity.designerId);
       },
       errRes => {
         console.log("error handeller >>@@",errRes );
        }
     );
     
   }
   // getDesignerList end
  //  getDesignerProducts start
  getDesignerProducts(designerId)
  {
    
    this.getProductSubscribe = this.http.get(this.productapi_url+'/'+designerId).subscribe(
      (response:any) => {
        // this.products = response;
        this.allproducts = response;
        console.log("Designer Products",this.allproducts);
      },
      errRes => {
        this.noproducts = true;
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
  // getDesignerProducts end
  public pageChange(newPage: number) {
		this.router.navigate(['/designer/'+this.parms_action_id+'/'], { queryParams: { page: newPage } });
	}

public setFilter(event){
  this.productfilter = event


  this.products = this.allItems.filter(function(ele){
    return ele.price <= event.to_price && ele.price>=event.from_price
  })
}
   // for follow designer start
  //  rating start
  countStar(star) {
    this.selectedValue = star;
    this.model.raiting = star;
    console.log('Value of star', star,this.model);


  }
  //  rating end
  // openfollowModal start
// openfollowModal start
openfollowModal(_identifier,followmodal,designer) {
  console.log("User",this.get_user_dtls,this.selectedValue);
  this.model = designer;
    this.model = {
      designerId:designer,
      userId:this.get_user_dtls.uid,
      isFollowing:true,
    }
  if(_identifier == 'follow')
  {
    
    // this.modalService.open(followmodal, { size: 'md' });
    console.log("this.model",this.model,designer);
  }else if(_identifier == 'unfollow')
  {
    this.model.isFollowing=false;
     
  }
  this.designerFollowSubscribe = this.http.post(this.followapi_url,this.model).subscribe(
    (response:any) => {
      console.log("response",response);
      if(response.status === 200){
        this.toastrService.success(response.message);
        // this.modalService.dismissAll();
      }else {
      }
      this.getDesignerById();
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
// openfollowModal end
  // openfollowModal end
   
  // onFollow submit start
  onSubmitFollowform(form:NgForm)
  {
    console.log(this.userdata);
    
    console.log("form.value",form.value);
    // var data ={
    //   comment:form.value.
    // }
    this.designerFollowSubscribe = this.http.post(this.followapi_url,form.value).subscribe(
      (response:any) => {
        console.log("response",response);
        if(response.status === 200){
          this.toastrService.success(response.message);
          this.modalService.dismissAll();
          form.reset();
          this.selectedValue = 0;
          this.model.raiting = 0;
        }else {
        }
        this.getDesignerById();
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
  // onFollow submit end
  // for follow designer end
  public productSlideConfig: any = {
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    autoplay: false,
    dots: true,
    autoplaySpeed: 3000,
    nextArrow:"<div class='nav-btn next-slide ti-angle-right'></div>",
    prevArrow:"<div class='nav-btn prev-slide ti-angle-left'></div>",
    responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots:false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots:false,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots:false,
        }
      },
      {
        breakpoint: 427,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows:false,
          dots:false,
        }
      }
    ]
  };
     // ngOnDestroy start
     ngOnDestroy() {
      if(this.getDesignerSubscribe !== undefined){
        this.getDesignerSubscribe.unsubscribe();
      }else if(this.getProductSubscribe !== undefined){
        this.getProductSubscribe.unsubscribe();
      }else if(this.designerFollowSubscribe !== undefined){
        this.designerFollowSubscribe.unsubscribe();
      }else if(this.logoutDataSubscribe !== undefined){
        this.logoutDataSubscribe.unsubscribe();
      }else if(this.getUserDetailss !== undefined){
        this.getUserDetailss.unsubscribe();
      }
    }  
    // ngOnDestroy end
}
