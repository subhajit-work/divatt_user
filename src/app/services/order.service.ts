import { Injectable } from '@angular/core';
import { Product } from '../classes/product';
import { CartItem } from '../classes/cart-item';
import { Order } from '../classes/order';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  
  // Array
  public OrderDetails;
  private OrderDataSubscribe: Subscription;
  orderId: any;
  TransactionId: any;

  constructor(private router: Router,private toastrService: ToastrService,private authService:LoginService,
    private http:HttpClient) { }

  // Get order items
  public getOrderItems(userId) : Order {
      // getProductList start
    this.OrderDataSubscribe = this.http.get('userOrder/getUserOrder/'+userId).subscribe(  
      (response:any) => {
        console.log("response",response);
        this.OrderDetails = response;
        console.log("this.products",this.OrderDetails);
        if(response.status === 200){
          this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
      },
      errRes => {
        console.log("error handeller >>@@",errRes );
        this.toastrService.error(errRes.error.message);
      }
    );
  // getProductList end
    return this.OrderDetails;
  }
  public setOrderId(orderId,TransactionId)  {
    // getProductList start
    console.log("orderId",orderId,TransactionId);
    
  this.orderId = orderId;
  this.TransactionId = TransactionId;
// getProductList end
  // return orderId;
}
public getOrderId()  {
  // getProductList start
// this.orderId = orderId;
// getProductList end
let data = {
  TransactionId:this.TransactionId,
  orderId:this.orderId
}
return data;
}

  // Create order
  public createOrder(product: any, details: any, orderId: any, amount: any) {
    var item = {
        shippingDetails: details,
        product: product,
        orderId: orderId,
        totalAmount: amount
    };
    this.OrderDetails = item;
    this.router.navigate(['/home/checkout/success']);
  }

}
