import { Component, OnInit, HostListener,ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { Product } from '../../classes/product';
import { ProductsService } from '../../services/products.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { Observable, of, Subscription } from 'rxjs';
import {SelectItem} from 'primeng/api';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/auth/auth.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';


declare var $: any;

@Component({
  selector: 'app-product-left-image',
  templateUrl: './product-left-image.component.html',
  styleUrls: ['./product-left-image.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProductLeftImageComponent implements OnInit {

  public products: Product[] = [];
  public counter            :   number = 1;
  selectedSize;
  public screenWidth
  public slideRightNavConfig

  productDetail:any={}
  currentState: string;
  public productImages : String[] = [];
  bigImg="assets/images/fashion/product/10.jpg";
  smallImgs=[
    {url:"assets/images/fashion/product/17.jpg"},
    {url:"assets/images/fashion/product/16.jpg"},
    {url:"assets/images/fashion/product/10.jpg"}
  ]
  imageSrc: string | ArrayBuffer;
  imageurls=[];
  base64String: string;
  name: string;
  imagePath: string;
  private productDataSubscribe: Subscription;
  api_url: string;
  productId: string;
  errorMsg: any;
  listapi_url: string;
  product: any;
  private getDesignerSubscribe: Subscription;
  designer: any;
  designerapi_url: string;
  followapi_url: string;
  private designerFollowSubscribe: Subscription;
  model: any;
  private logoutDataSubscribe: Subscription;
  get_user_dtls: any;
  userdata: any;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  isFollowing: boolean;
  size;
  selectedColor: any;
  main_url = environment.apiUrl;
  designerPic: string;
  follwerCount: any;
  productCount: any;
  //Get Product By Id
  constructor(private route: ActivatedRoute, private router: Router,
    public productsService: ProductsService, private wishlistService: WishlistService,
    private cartService: CartService,private http : HttpClient,
    private toastrService: ToastrService,
    private activatedRoute : ActivatedRoute,private modalService: NgbModal,private authService:LoginService) {
      // this.route.params.subscribe(params => {
      //   const id = +params['id'];
      //   this.productsService.getProduct(id).subscribe(product => this.productDetail = product )
      // });
      // this.onResize();
  }
  
  ngOnInit() {
    // this.productsService.getProducts().subscribe(product => this.products = product);
    this.commonFunction();
    $.getScript('assets/js/sticky-kit.js');
    $.getScript('assets/js/menu.js');
   this.scrollToTop();
  }
  isReadMore = true
  
  // commonFunction start
  commonFunction()
  {
    this.productId = this.activatedRoute.snapshot.params.id;
    
    this.listapi_url = 'user/product/list';
    this.designerapi_url = 'user/designerProfile'
    this.followapi_url = 'user/followDesigner'
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        console.log("this.get_user_dtls");
        this.getProductByid()
      }
    });
    if(!this.get_user_dtls)
    {
       this.getProductByid();
       console.log("!this.get_user_dtls");
       
    }
    this.getProductList();
   
  }
  // commonFunction end
  // getProductByid start
  ImageForSlider:any=[];
  getProductByid()
  {
    
    if(this.get_user_dtls)
    {
      this.api_url = 'user/view/'+this.productId+'?userId='+this.get_user_dtls.uid
    }else
    {
      this.api_url = 'user/view/'+this.productId;
    }
        // this.api_url+'?userId='+this.get_user_dtls.uid
    this.productDataSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        console.log("response",response);
        
        
        this.productDetail = response;
        console.log("this.productDetail.images[i].name",this.productDetail.images,this.productDetail.images.length);
        for(let i = 0; i < this.productDetail.images.length; i++)
        {
          if(this.productDetail.images[i].name != '')
          {
            this.ImageForSlider.push(this.productDetail.images[i].name);
            
          }

        }
        
        console.log("this.products",this.products,this.ImageForSlider);
        this.getDesignerById();
        // this.toastrService.success(response.message);
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
        this.toastrService.success(errRes.message);
      }
    );
  }
  // getProductByid end
  // getProductList start
  getProductList()
  {
 
    this.productDataSubscribe = this.http.get(this.listapi_url).subscribe(
      (response:any) => {
        console.log("response",response);
        this.products = response;
        console.log("this.products",this.products);
        // this.toastrService.success(response.message);
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
        this.toastrService.success(errRes.message);
      }
    );
  }
  // getProductList end
  scrollToTop() {
    console.log('a');
    
}

  changeImg(url)
  {
    this.bigImg = url;
  }
  public slideRightConfig: any = {
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    dots:true,
  };
  public reviewslidersconfig = {
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
    dots:true,
    nextArrow:"<div class='nav-btn next-slide fa fa-angle-right'></div>",
    prevArrow:"<div class='nav-btn prev-slide fa fa-angle-left'></div>",
    arrow:true,
    responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            }
          },
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots:false,
              arrow:false,
            }
          },
          {
            breakpoint: 426,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots:false,
              arrow:false,
            }
          }
        ]
  };
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
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
      this.screenWidth = window.innerWidth;
      if (this.screenWidth > 576) {
         return this.slideRightNavConfig = {
            vertical: true,
            verticalSwiping: true,
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.product-right-slick',
            arrows: false,
            infinite: true,
            dots: false,
            centerMode: false,
            focusOnSelect: true
        }
     } else {
        return this.slideRightNavConfig = {
            vertical: false,
            verticalSwiping: false,
            slidesToShow: 3,
            slidesToScroll: 1,
            asNavFor: '.product-right-slick',
            arrows: false,
            infinite: true,
            centerMode: false,
            dots: false,
            focusOnSelect: true,
            responsive: [
                  {
                      breakpoint: 576,
                      settings: {
                          slidesToShow: 3,
                          slidesToScroll: 1
                      }
                  }
            ]
        }
     }
  }



  public increment() {
      this.counter += 1;
  }

  public decrement() {
      if(this.counter >1){
          this.counter -= 1;
      }
  }

   // Change size variant
   public changeSizeVariant(variant) {
    this.selectedSize = variant;
 }
 public changeColorVariant(variant) {
  this.selectedColor = variant;
  console.log(this.selectedColor);
  
}
  // Add to cart
  public addToCart(product: Product, quantity) {
    if (quantity == 0) return false;
    product.selectedSize = this.selectedSize;
    this.cartService.addToCart(product, parseInt(quantity));
  }

  // Add to cart
  public buyNow(product: Product, quantity) {
     if (quantity > 0)
       this.cartService.addToCart(product,parseInt(quantity));
       this.router.navigate(['/home/address']);
  }

  // Add to wishlist
  public addToWishlist(product: Product) {
     this.wishlistService.addToWishlist(product);
  }

 
// scroll event detect
// isFixedHeader;
// onScrollHedearFix(event) {
//   console.log('scroll onnnnnnnnn', event.detail.scrollTop);
//   if (event.detail.scrollTop > 35) {
//     // console.log("scrolling down, hiding footer...iffffffffffff");
//     this.isFixedHeader = true;
//   } else {
//     // console.log("scrolling up, revealing footer...elseeeeeeeeeeeeeee");
//     this.isFixedHeader = false;
//   };
// }
//  readURL(e) {
//   if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];

//       const reader = new FileReader();
//       reader.onload = e => this.imageSrc = reader.result;

//       reader.readAsDataURL(file);
//   }
// }
  // getDesignerList start
  getDesignerById()
  {
    this.getDesignerSubscribe = this.http.get(this.designerapi_url+'/'+this.productDetail.designerId).subscribe(
      (response:any) => {
        this.designer = response;
        this.designerPic = response.designerProfileEntity.designerProfile.profilePic;
        this.follwerCount = response.follwerCount;
        this.productCount = response.productCount;
        console.log("DesignerisFollowing",this.designer.isFollowing);
        if(this.designer.isFollowing == true)
        {
          this.isFollowing = true
        }else if(this.designer.isFollowing == false)
        {
          this.isFollowing = false
        }
        if(response.status === 200){
        //  this.toastrService.success(response.message);
          
        }else {
          // this.toastrService.error(response.message);
        }
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
      
        this.toastrService.success(errRes.message);
      }
    );
    
  }
  // getDesignerList end
onSelectFile(event) {
  if (event.target.files && event.target.files[0]) {
    var filesAmount = event.target.files.length;
    for (let i = 0; i < filesAmount; i++) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageurls.push({ base64String: event.target.result, });
      }
      reader.readAsDataURL(event.target.files[i]);
    }
  }
}
openModal(updatemodal) {
  this.modalService.open(updatemodal, { size: 'md' });
}
// to close modal   -> this.modalService.dismissAll()
removeImage(i) {
  this.imageurls.splice(i, 1);
}
  //  rating start
  countStar(star) {
    this.selectedValue = star;
    this.model.raiting = star;
    console.log('Value of star', star,this.model);


  }
  //  rating end
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
        this.modalService.dismissAll();
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

  custom_modal(content){
    this.modalService.open(content, { size: 'xl' });
  }
  onSubmitchart(){
    
  }
  
  ngOnDestroy() {
    if (this.productDataSubscribe !== undefined) {
      this.productDataSubscribe.unsubscribe();
    }if (this.getDesignerSubscribe !== undefined) {
      this.getDesignerSubscribe.unsubscribe();
    }if (this.designerFollowSubscribe !== undefined) {
      this.designerFollowSubscribe.unsubscribe();
    }
    if (this.logoutDataSubscribe !== undefined) {
      this.logoutDataSubscribe.unsubscribe();
    }
  }
  



}
