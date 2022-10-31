import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
// import { PayPalConfig, PayPalEnvironment, PayPalIntegrationType } from 'ngx-paypal';
// import {  IPayPalConfig,  ICreateOrderRequest } from 'ngx-paypal';
import { CartItem } from '../../classes/cart-item';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Observable, of, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/auth/auth.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-billing-address',
  templateUrl: './billing-address.component.html',
  styleUrls: ['./billing-address.component.css']
})
export class BillingAddressComponent implements OnInit {
  Citys =[]
  Countrys =[
    {
      value:1,viewValue:"India"
    },
  ]
  states= [];
  // form group
  public checkoutForm   :  FormGroup;
  public cartItems      :  Observable<CartItem[]> = of([]);
  public checkOutItems  :  CartItem[] = [];
  public orderDetails   :  any[] = [];
  public amount         :  number;
  buttonsshow:boolean = false;
  private getAddressSubscribe: Subscription;
  api_url: string;
  addresslist: any={};
  unsaveAddress: any=[{}];
  model:any =  {};
  private logoutDataSubscribe: Subscription;
  get_user_dtls: any = {};
  add_api: string;
  update_api: string;
  private addressFormSubmitSubscribe: Subscription;
  private UpdateFormSubmitSubscribe: Subscription;
  action;
  alldata: any = {};
  total_price: number;
  getCartlistSubscribe: Subscription;
  userId: any;
  cartlistapi: string;
  deleteAddressSubscribe: Subscription;
  addressdelApi: string;
  addressId: any;
  nounsaveAddress: any = false;
  noadressFound: boolean;
  loader: boolean;
  identifire: string;
  addressViewType: any;
 
  // public payPalConfig ? : PayPalConfig;


  // Form Validator
  constructor(private fb: FormBuilder, private cartService: CartService, 
    public productsService: ProductsService, private orderService: OrderService,
    private http : HttpClient,private router: Router,
    private toastrService: ToastrService,private authService:LoginService,private activatedRoute : ActivatedRoute,) {
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z][a-zA-Z ]+[a-zA-Z]$')]],
      phone: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required, Validators.maxLength(50)]],
      country: ['', Validators.required],
      town: ['', Validators.required],
      state: ['', Validators.required],
      postalcode: ['', Validators.required]
    })    
  }

  ngOnInit() {
    this.addressViewType = this.activatedRoute.snapshot.params.type;
    if(this.addressViewType == 'all' || this.addressViewType =='shop')
    {

    }else{
      this.router.navigate(['profile'])
    }
    this.cartItems = this.cartService.getItems();
    this.cartItems.subscribe(products => this.checkOutItems = products);
    console.log("this.checkOutItems",this.checkOutItems);
    this.getTotal().subscribe(amount => this.amount = amount);
    // this.initConfig();
	      var getsession = JSON.parse(window.sessionStorage.getItem("address"));
        if(getsession)
        {
          console.log("getsession",getsession,this.unsaveAddress);
          this.unsaveAddress[0] = getsession;
          this.nounsaveAddress = true;
          this.noadressFound = false;
        }else{
          this.nounsaveAddress = false;
          this.noadressFound = true;
        }
        console.log("getsession",getsession,this.unsaveAddress);
    this. commonFunction();
  }

  commonFunction()
  {
    this.api_url = "user/address";
    this.add_api = 'user/address';
    
    this.action = 'add';
    this.model.addressType = 'Home';
    this.getAddressList()
    this.getStates();
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        this.userId = this.get_user_dtls.uid
        this.cartlistapi = "user/cart/getUserCart?userId="+this.userId;
        this.getCartListData()
        // user details set
      }
    });
    this.model.userId = this.get_user_dtls.uid
  }
  
  // Get sub Total
  public getTotal(): Observable<number> {
    return this.cartService.getTotalAmount();
  }
 
  // stripe payment gateway
  stripeCheckout() {
      var handler = (<any>window).StripeCheckout.configure({
        key: 'PUBLISHBLE_KEY', // publishble key
        locale: 'auto',
        token: (token: any) => {
          // You can access the token ID with `token.id`.
          // Get the token ID to your server-side code for use.
          this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, token.id, this.amount);
        }
      });
      handler.open({
        name: 'Multikart',
        description: 'Online Fashion Store',
        amount: this.amount * 100
      }) 
      
      
  }
  selectAddress:any = false;
  addressSelected(data)
  {
    console.log(data);
    this.selectAddress = data.id;
  }
  // Paypal payment gateway
  // private initConfig(): void {
  //     this.payPalConfig = new PayPalConfig(PayPalIntegrationType.ClientSideREST, PayPalEnvironment.Sandbox, {
  //       commit: true,
  //       client: {
  //         sandbox: 'CLIENT_ID', // client Id
  //       },
  //       button: {
  //         label: 'paypal',
  //         size:  'small',    // small | medium | large | responsive
  //         shape: 'rect',     // pill | rect
  //         //color: 'blue',   // gold | blue | silver | black
  //         //tagline: false  
  //       },
  //       onPaymentComplete: (data, actions) => {
  //         this.orderService.createOrder(this.checkOutItems, this.checkoutForm.value, data.orderID, this.amount);
  //       },
  //       onCancel: (data, actions) => {
  //         console.log('OnCancel');
  //       },
  //       onError: (err) => {
  //         console.log('OnError');
  //       },
  //       transactions: [{
  //         amount: {
  //           currency: this.productsService.currency,
  //           total: this.amount
  //         }
  //       }]
  //     });
  // }

     // getDesignerList start
  getAddressList()
  {
  this.loader = true;
  this.model.addressType = 'Home';
  this.model.userId = this.get_user_dtls.uid;
  this.action = 'add';
    this.getAddressSubscribe = this.http.get(this.api_url).subscribe(
      (response:any) => {
        this.addresslist = response;
        console.log("addresslist",this.addresslist);
        this.noadressFound = false;
      //  console.log("Designer",this.designer.UserDesigner.length);
        //  this.toastrService.success(response.message);
        this.loader = false;
          
      },
      errRes => {
      this.loader = false;
        console.log("error handeller >>@@",errRes );
        this.noadressFound = true;
        this.toastrService.success(errRes.error.message);
        console.log("addresslist",this.addresslist);
      }
    );
    
  }
  // getDesignerList end
  getStates()
  {
    this.addressFormSubmitSubscribe = this.http.get("user/getStateData").subscribe(
      (response:any) => {
         this.states = response;
      },
      errRes => {
        this.toastrService.error(errRes.error.message);
      }
    ); 
  }
  //  editAddress start
  editAddress(data,type)
  {
    if(type == 'unsaveData')
    {
      this.identifire = 'unsaveData';
    }
    this.action = 'edit';
    this.model = 
    {
      fullName:data.fullName,
      address1:data.address1,
      address2:data.address2,
      addressType:data.addressType,
      mobile:data.mobile,
      state:data.state,
      country:data.country,
      city:data.city,
      landmark:data.landmark,
      primary:data.primary,
      postalCode:data.postalCode,
      email:data.email,
      id:data.id,
    }
    
    console.log(" this.model", this.model);
    
    this.update_api = 'user/address/'+data.id;
    this.formOpen = true;
  }
  // editAddress end
  addressType(addressType)
  {
    this.model.addressType = addressType;
  }
  // onSubmitAddressForm start
  onSubmitAddressForm(form:NgForm)
  {
    console.log("form.value",form.value);
    // this.selectAddress = true;
    if(!form.value.ask)
    {
      form.value.ask = false;
    }
    console.log("form.value",form.value);
    if(form.value.address1 == undefined)
    {
      this.toastrService.warning('Fill the details..');
      this.action = 'add';
      return false;
    }

    this.alldata = {
      fullName:form.value.fullName,
      address1:form.value.address1,
      address2:form.value.address2,
      mobile:form.value.mobile,
      state:form.value.state,
      country:form.value.country,
      email:form.value.email,
      city:form.value.city,
      landmark:form.value.landmark,
      primary:form.value.primary,
      addressType:form.value.addressType,
      postalCode:form.value.postalCode,
      userId:this.get_user_dtls.uid,
    }
    console.log("alldata",this.alldata);
    
    if(form.value.primary == undefined || form.value.primary == null)
    {
        this.alldata.primary = false;
    }
    // save or not start
    if(form.value.ask == true)
    {
      if(this.action == 'edit')
      {
        
        this.UpdateFormSubmitSubscribe = this.http.put(this.update_api,this.alldata).subscribe(
          (response:any) => {
            console.log("response",response);
            this.toastrService.success(response.message);
            this.getAddressList();
            
            form.reset();
            this.formOpen = false;
          },
          errRes => {
            console.log("error handeller >>@@",errRes );
            this.toastrService.error(errRes.error.message);
          }
        );
        
      }else if(this.action == 'add') 
      {
        this.addressFormSubmitSubscribe = this.http.post(this.add_api,this.alldata).subscribe(
          (response:any) => {
            this.toastrService.success(response.message);
            this.getAddressList();
            form.reset();
            this.formOpen = false;
            
          },
          errRes => {
            console.log("error handeller >>@@",errRes );
            this.toastrService.error(errRes.error.message);
          }
        ); 
      }
    }
    else
    {
      this.alldata = {
        fullName:form.value.fullName,
        address1:form.value.address1,
        address2:form.value.address2,
        mobile:form.value.mobile,
        state:form.value.state,
        country:form.value.country,
        email:form.value.email,
        city:form.value.city,
        landmark:form.value.landmark,
        primary:form.value.primary,
        addressType:form.value.addressType,
        postalCode:form.value.postalCode,
        id:'guest',
      }
      var setsession = window.sessionStorage.setItem("address",JSON.stringify(this.alldata));
      var getsession = JSON.parse(window.sessionStorage.getItem("address"));
      console.log("getsession",getsession,this.unsaveAddress);
      this.nounsaveAddress = true;
      this.noadressFound = false;
      this.formOpen = false;
      this.unsaveAddress[0] = getsession;
      this.router.navigateByUrl(`/checkout/guest`);
      // sessionStorage.clear();
      console.log("getsession",getsession,this.unsaveAddress);
    }
    // save or not end
    this.model.addressType = 'Home';
  }
  // onSubmitAddressForm end
    ngsel(e)
    {

    }
    // addressSelected end
      //  get wish list after login start
  getCartListData() {
    this.getCartlistSubscribe = this.http.get(this.cartlistapi).subscribe(
      (response: any) => {
        console.log('Cart list', response);
        // this.shoppingCartItems = response;
        this.total_price = 0
        var getitemTotal = 0
        for(let i = 0;i < response.length; i++)
        {
          getitemTotal = response[i].cartData.qty * response[i].price.indPrice.dealPrice
          this.total_price = this.total_price + getitemTotal;
        }
        
      },
      errRes => {
        this.toastrService.error(errRes.error.message); 
        
      }
    );
  }
  //  get wish list after login end
  // deleteAddress start
  async toDeleteAddress(address,type) {

    this.addressId = address.id
    this.addressdelApi = "user/address/"+address.id;
    console.log("address",address,this.addressId);
    
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
      title: 'Delete',
      text: 'Are you went to Delete this address ?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: false
    }
    ).then((result) => {
      if (result.value) {
        console.log('Delete');
        if(type == 'savedata')
        {
          this.deleteAddress();
        }else 
        if(type == 'unsavedata')
        {
          sessionStorage.clear();
          this.unsaveAddress[0] = '';
          this.nounsaveAddress = false;
          this.selectAddress = '';
          console.log("getsession",this.unsaveAddress);
          this.model = undefined;
          this.model = 
            {
              fullName:undefined,
              address1:undefined,
              address2:undefined,
              addressType:undefined,
              mobile:undefined,
              state:undefined,
              country:undefined,
              city:undefined,
              landmark:undefined,
              primary:undefined,
              postalCode:undefined,
              email:undefined,
              id:undefined,
            }
          // this.unsaveAddress[0] = getsession;
          var getsession = JSON.parse(window.sessionStorage.getItem("address"));
          if(getsession)
          {
            this.noadressFound = false;
          }else{
            this.noadressFound = true;
          }
          // console.log("getsession",getsession,this.unsaveAddress);
        }
       
        return;
      }
      console.log('cancel');
    });
  }
  deleteAddress()
  {
    this.deleteAddressSubscribe = this.http.delete(this.addressdelApi).subscribe(
      (response: any) => {
        console.log('deleteAddressSubscribe', response);
        // this.shoppingCartItems = response;     
        this.nounsaveAddress = false;
          this.selectAddress = '';
          console.log("getsession",this.unsaveAddress);
          this.model = undefined;
          this.model = 
            {
              fullName:undefined,
              address1:undefined,
              address2:undefined,
              addressType:undefined,
              mobile:undefined,
              state:undefined,
              country:undefined,
              city:undefined,
              landmark:undefined,
              primary:undefined,
              postalCode:undefined,
              email:undefined,
              id:undefined,
            }
          // this.unsaveAddress[0
        this.getAddressList();
        this.toastrService.success(response.message);    
      },
      errRes => {
        this.toastrService.warning(errRes.error.message); 
        this.getAddressList();
      }
    );
  }
  // deleteAddress end
  formOpen = false;
  OpenForm()
  {
    this.formOpen = !this.formOpen;
  }
  ngOnDestroy() {
    if (this.getAddressSubscribe !== undefined) {
      this.getAddressSubscribe.unsubscribe();
    }
    if (this.logoutDataSubscribe !== undefined) {
      this.logoutDataSubscribe.unsubscribe();
    }
    if (this.addressFormSubmitSubscribe !== undefined) {
      this.addressFormSubmitSubscribe.unsubscribe();
    }  
    if (this.deleteAddressSubscribe !== undefined) {
      this.deleteAddressSubscribe.unsubscribe();
    }
  }
     
}
