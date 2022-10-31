import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { LoginService } from '../services/auth/auth.service';
import { CommonUtils } from '../services/common-utils/common-utils';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { LoginNavService } from '../services/login-nav.service';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  /* Variable start */
  private getUserDetailss:Subscription;
  private logoutDataSubscribe : Subscription;
  viewLoading = false;
  getUserDetailsList_api;
  get_user_dtls;
  userDetailsFromApi: any = {};
  model: any = {};
  isLoading: boolean;
  errorMsg: string;
  private formSubmitSubscribe: Subscription;
  api_url;
  formdata:any= {};
  dateofbirth;
  modalDate: string;
  dob: string;
  imageLoader: boolean;
  constructor(
    private http : HttpClient,
    private authService:LoginService,
    private commonUtils: CommonUtils,
    private toastrService: ToastrService,
    private modalService: NgbModal,private loginNav: LoginNavService
    // private datepipe: DatePipe
  ) { }

  ngOnInit() {
    this.commonFunction();
    
  }
  commonFunction()
  {
    this.api_url = 'user/update';
    this.logoutDataSubscribe = this.authService.globalparamsData.subscribe(res => {
      console.log('(header)  globalparamsData res ssss >>>>>>>>>>>', res);
      if(res != null || res != undefined){
        this.get_user_dtls = res.logininfo;
        console.log('this.get_user_dtls************', this.get_user_dtls);
        // user details set
        this.commonUtils.onClicksigninCheck(res);
      }
    });


    this.getUserDetailsList_api = 'auth/info/'+ this.get_user_dtls.authority+'/'+this.get_user_dtls.email;
    this.getUserDetailsList();
  }
  /* -------------Get modules start------------- */
  getUserDetailsList(){
    this.viewLoading = true;
    this.getUserDetailss = this.http.get(this.getUserDetailsList_api).subscribe(
        (res:any) => {
          
          this.userDetailsFromApi = res;
          this.model = res;
          console.log("this.modalDate",this.model.dob);
          this.model.dob = moment(res.dob).format('YYYY-MM-DD');
          console.log("this.modalDate",this.model.dob);
          
          this.viewLoading = false;
        },
        errRes => {
           console.log("Get moduleList >", errRes); 
           this.viewLoading = false; 
        }
      );
  }
  // changeDateFormat start
 dateFormatChange(_date)
{
  // console.log("_identifier",_identifier,_date,this.adminprofiledata.dob,this.designerprofiledata.designerProfile.dob);
  console.log("this.model.senddob",this.model.senddob,_date);
    this.model.senddob= moment(_date).format('YYYY/MM/DD');
    console.log("this.model.senddob",this.model.senddob,_date);
    
  // console.log("_identifier",_identifier,_date,this.adminprofiledata.dob,this.designerprofiledata.designerProfile.dob);
  
}
// changeDateFormat end
  // ======================== on submit update user data start ===================
  onSubmitUserAccount(form:NgForm){
    this.isLoading = true;
    this.errorMsg = '';
    console.log('form >>', form.value);
    // get form value
    let fd = new FormData();
    
    for (let val in form.value) {
      if(form.value[val] == undefined){
        form.value[val] = '';
      }
      fd.append(val, form.value[val]);
    };

    if(!form.valid){
      return;
    }
    var dob;
    if(form.value.senddob)
    {
      console.log("form.value.senddob if",form.value.senddob);
    dob = form.value.senddob;
      
    }else{
      console.log("form.value.senddob else",form.value.senddob);
      dob = moment(this.model.dob).format('YYYY/MM/DD')

      
    }
    this.formdata = {
      firstName:form.value.firstName,
      lastName:form.value.lastName,
      mobileNo:form.value.mobileNo,
      dob:dob,
      email:form.value.email,
      id:this.userDetailsFromApi.uId,
      password:this.userDetailsFromApi.password,
      username:this.userDetailsFromApi.username,
      profilePic:this.userDetailsFromApi.profilePic,
    }
    this.formSubmitSubscribe = this.http.put(this.api_url, this.formdata).subscribe(
      (response:any) => {
        console.log('response', response);
        
        if(response.status === 200){
        this.isLoading = false;
          
          this.modalService.dismissAll();
          this.getUserDetailsList();
          form.reset();
          this.toastrService.success(response.message);
          
            }else {
          this.toastrService.error(response.message);
          this.isLoading = false;
        }
      },
      errRes => {
        this.isLoading = false;
        console.log("error handeller >>@@",errRes );
        if(errRes.error.message){
          this.errorMsg = errRes.error.message;
        }else if(errRes.error.messagee){
          this.errorMsg = errRes.error.messagee;
        } else {
          this.toastrService.error(errRes.message);
        }
        
      }
    );

}
// CreateAccount form submit end
 // on submit update user data end
 filePath;
 chooseFile(image)
 {
  var file = image.dataTransfer ? image.dataTransfer.files[0] : image.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      // alert('invalid format');
      this.toastrService.error('invalid file format');

      return;
    }
    else
  console.log('image',image);
  
   // console.log('image',image.target.files[0]);
   if(image.target.files[0] != undefined)
   {
     this.imageLoader = true;
     var fd = new FormData(); 
     fd.append("file", image.target.files[0]);
     this.http.post("admin/profile/s3/upload",fd).subscribe(
       (res:any) => {
        this.filePath = res.path;
        this.updateProfile();
       },
       (error) =>{
         console.log("error",error);
         this.imageLoader = false;
       })
   }
 }
 // chooseFile
//  updateProfile start to choose profile pic
updateProfile()
{
  this.formdata = {
    firstName:this.userDetailsFromApi.firstName,
    lastName:this.userDetailsFromApi.lastName,
    mobileNo:this.userDetailsFromApi.mobileNo,
    dob:this.userDetailsFromApi.dob,
    email:this.userDetailsFromApi.email,
    id:this.userDetailsFromApi.uId,
    password:this.userDetailsFromApi.password,
    username:this.userDetailsFromApi.username,
    profilePic:this.filePath,
  }
  this.formSubmitSubscribe = this.http.put(this.api_url, this.formdata).subscribe(
    (response:any) => {
      console.log('response', response);
      this.imageLoader = false;
      this.getUserDetailsList();
      this.toastrService.success(response.message);
    },
    errRes => {
      this.imageLoader = false;
        this.toastrService.error(errRes.error.message);
      
      
    }
  );
}
  // updateProfile end
  openModal(updatemodal) {
    this.modalService.open(updatemodal, { size: 'md' });
  }

  openchangepasswordNav()
  {
    // this.showScreen = 'login';
    this.loginNav.addNavchangepassword();
  }
  // Logout user start
  logOutUser(){
    this.authService.logout();
  }
  ngOnDestroy() {
    if (this.getUserDetailss !== undefined) {
      this.getUserDetailss.unsubscribe();
    }if (this.formSubmitSubscribe !== undefined) {
      this.formSubmitSubscribe.unsubscribe();
    }
    if (this.logoutDataSubscribe !== undefined) {
      this.logoutDataSubscribe.unsubscribe();
    }
  }
}
