import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { Product } from 'src/app/classes/product';
import { LoginService } from 'src/app/services/auth/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { ProductsService } from 'src/app/services/products.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

 
  public product        :   Observable<Product[]> = of([]);
  public OrderlistItems  :any = {};
  logoutDataSubscribe: any;
  get_user_dtls: any;
  userId: string;
  private OrderDataSubscribe: Subscription;
  OrderDetails: any;
  emptyOrderList: boolean;
  private cancelOrderDataSubscribe: Subscription;
  private stockRecorverSubscribe: Subscription;
  loader: boolean;

  constructor(private orderService: OrderService,private router: Router,private toastrService: ToastrService,private authService:LoginService,
    private http:HttpClient) { 
    // this.product.subscribe(products => this.OrderlistItems = products);
  }

  ngOnInit() {
  	
    this.commonFunction();
  }
  commonFunction(){
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        this.userId = this.get_user_dtls.uid;
      }
    });
    this.getOrderList();
    // this.OrderlistItems = this.orderService.getOrderItems(this.get_user_dtls.uid);
    console.log("this.OrderlistItems",this.OrderlistItems);
    
  }
getOrderList()
{
  this.loader = true;
    // getProductList start
    this.OrderDataSubscribe = this.http.get('userOrder/getUserOrder/'+this.userId).subscribe(  
      (response:any) => {
        console.log("response",response);
        this.OrderlistItems = response;
        console.log("this.products",this.OrderlistItems);
        if(response.status === 200){
          this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
        this.loader = false;
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
        // this.toastrService.show(errRes.error.message);
        this.loader = false;
      }
    );
  // getProductList end
}
// cancel order start
async askCancleOrder(orderId,product) {

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
    title: 'Order Cancel',
    text: 'Are you went to Cancel this order ?',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    reverseButtons: false
  }
  ).then((result) => {
    if (result.value) {
      console.log('Delete');
      this.cancleOrder(orderId,product)
      return;
    }
    console.log('cancel');
  });
}
cancleOrder(orderId,product)
{
  console.log("item",orderId,product.productId);
  // var data;
  this.cancelOrderDataSubscribe = this.http.put('userOrder/cancelOrder/'+orderId+'/'+product.productId,'').subscribe(
    (response:any) => {
      this.stockRecorver(product)
      this.toastrService.success(response.message);
    },
    errRes => {
      console.log("error handeller >>@@",errRes );
      
      this.toastrService.error(errRes.error.message);
    }
  );
  setTimeout(() => {
    this.getOrderList();  
  }, 1000);
  
}
// cancel order end
stockRecorver(data)
{
  this.stockRecorverSubscribe = this.http.put('designerProduct/stockRecoverService',data).subscribe((response:any) => {},
    errRes => {this.toastrService.error(errRes.error.message);});
}
ngOnDestroy() {
  if (this.OrderDataSubscribe !== undefined) {
    this.OrderDataSubscribe.unsubscribe();
  }
  if (this.cancelOrderDataSubscribe !== undefined) {
    this.cancelOrderDataSubscribe.unsubscribe();
  }
}
}
