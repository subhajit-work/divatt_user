import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/auth/auth.service';
import { Order } from '../../classes/order';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  public orderDetails : Order = {};
  logoutDataSubscribe: Subscription;
  get_user_dtls;
  api_url: string;
  private getOrderDataSubscribe: Subscription;
  orderId;
  private removeOrderProductSubscribe: Subscription;
  private genaratePDFSubscribe: Subscription;
  TransactionId;

  constructor(private orderService: OrderService,private authService:LoginService,
    private toastrService:ToastrService,private activatedRoute : ActivatedRoute,
    private http:HttpClient) { }

  ngOnInit() {
  	
    this.commonFunction();
  }
  commonFunction(){
    // this.orderService.setOrderId('OR1658498003170');
    var data = this.orderService.getOrderId(); 
    this.orderId = this.activatedRoute.snapshot.paramMap.get('orderId');
    // this.orderId = data.orderId;
    this.TransactionId = data.TransactionId;
    console.log("OR1653549642407",this.orderId);
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        this.api_url = 'userOrder/getOrder/' +this.orderId;
        // OR1654515366048
        this.getorderDetails();
      }
    });
    // this.orderDetails = this.orderService.getOrderItems(this.get_user_dtls.uid);
  }
  // orderDetails start
  getorderDetails()
  {
    this.getOrderDataSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        this.orderDetails = response;
        sessionStorage.clear();
        console.log("orderDetails",this.orderDetails);
        if(response.status === 200){
          this.toastrService.success(response.message);
          
        }else {
       }
      //  this.genaratePDF();
       this.removeorderProducts(response.OrderSKUDetails);
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
       
        this.toastrService.error(errRes.error.message);
      }
    );
  }
  
  // orderDetails end
   // removeorderProducts start
   removeorderProducts(data)
   {
     this.removeOrderProductSubscribe = this.http.put('designerProduct/stockClearence',data).subscribe(
       (response:any) => {
         console.log(response);
         
       },
       errRes => {
         console.log("error handeller >>@@",errRes );
        
         this.toastrService.error(errRes.error.message);
       }
     );
   }
  //  removeorderProducts  end
  // genarate PDF start
  genaratePDF()
  {
    console.log("orderDetails",this.orderDetails);
    var data = {
      billingAddress:this.orderDetails.billingAddress,
      createdOn:this.orderDetails.createdOn,
      discount:this.orderDetails.discount,
      id:this.orderDetails.id,
      mrp:this.orderDetails.mrp,
      netPrice:this.orderDetails.netPrice,
      products:this.orderDetails.products,
      orderId:this.orderDetails.orderId,
      shippingAddress:this.orderDetails.shippingAddress,
      totalAmount:this.orderDetails.totalAmount,
      userId:this.orderDetails.userId,
      taxAmount:this.orderDetails.taxAmount,
      userInv:this.orderDetails.userInv,
    }
    this.genaratePDFSubscribe = this.http.post('userOrder/genpdf/order',data).subscribe(
      (response:any) => {
        console.log(response);
        
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
       
        this.toastrService.error(errRes.error.message);
      }
    );
  }
  // genarate PDF end
  ngOnDestroy() {
    if (this.getOrderDataSubscribe !== undefined) {
      this.getOrderDataSubscribe.unsubscribe();
    }
    if (this.removeOrderProductSubscribe !== undefined) {
      this.removeOrderProductSubscribe.unsubscribe();
    }
  }
}
