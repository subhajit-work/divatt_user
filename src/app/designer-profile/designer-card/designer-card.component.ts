import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LoginService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-designer-card',
  templateUrl: './designer-card.component.html',
  styleUrls: ['./designer-card.component.css']
})
export class DesignerCardComponent implements OnInit {
  private designerListSubscribe: Subscription;
  private designerFollowSubscribe: Subscription;
  api_url: string;
  designerlist :any = [];
  errorMsg: any;
  followapi_url: string;
  model: any={};
  logoutDataSubscribe: any;
  get_user_dtls: any;
  getUserDetailsList_api: string;
  private getUserDetailss: Subscription;
  userDetailsFromApi: any;
  userdata: any;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedValue: number;
  gridMode:boolean;
  type;
  loader: boolean;
  designerType: string;
  constructor(private http:HttpClient,
    private toastrService: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router,private modalService: NgbModal,
    private authService:LoginService,) { }

  ngOnInit() {
    this.commonFunction();
  }
  // commonFunction start
  commonFunction()
  {
    this.gridMode = true;
    this.type = this.activatedRoute.snapshot.params.type;
    this.designerType = this.activatedRoute.snapshot.params.type;
    console.log("Page Name",this.type);
    
    // this.api_url = "designer/getDesignerDetails/"+this.type;
    this.followapi_url = 'user/followDesigner'
    this.getDesignerList();
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
      }
    });


    this.getUserDetailsList_api = 'auth/info/'+ this.get_user_dtls.authority+'/'+this.get_user_dtls.email;
    // this.getUserDetailsList();
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
  // changeType start
changeType(_type)
{
  this.designerType = _type;
  this.getDesignerList();
}
// changeType end
  // getDesignerList start
  getDesignerList()
  {
    this.designerlist = [];
    this.loader = true;
    this.designerListSubscribe = this.http.get("designer/getDesignerDetails/"+this.designerType).subscribe(
      (response:any) => {
        console.log("response",response);
        // this.designerlist = response;
        for (let index = 0; index < response.length; index++) {
          if(response[index].productCount > 0)
          {
            this.designerlist.push(response[index]);
          }
          
        }
        // }
        this.loader = false;

        console.log("designerlist",this.designerlist);
        if(response.status === 200){
          this.toastrService.success(response.message);
        }else {
          // this.toastrService.error(response.message);
        }
      },
      errRes => {
        this.loader = false;

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

  // changeDisplay start
  changeDisplay(_identifier){
    
    
    if(_identifier == 'grid') {
      this.gridMode = true;
    }else if(_identifier == 'list'){
      this.gridMode = false;
    }
    console.log('_identifier', _identifier + this.gridMode);
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
          this.modalService.dismissAll();
        }else {
        }
        this.getDesignerList();
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
          this.getDesignerList();
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
 ngOnDestroy() {
    if(this.designerListSubscribe !== undefined){
      this.designerListSubscribe.unsubscribe();
    }else if(this.designerFollowSubscribe !== undefined){
      this.designerFollowSubscribe.unsubscribe();
    }else if(this.getUserDetailss !== undefined){
      this.getUserDetailss.unsubscribe();
    }

  }  
  // ngOnDestroy end
}
