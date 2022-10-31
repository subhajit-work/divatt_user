import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  api_url;
  model: any = {};
  isLoading = false;
  errorMsg;
  parms_link;
  parms_time;
  hide = true;
  hide2 = true;
  hide3 = true;
  private formSubmitSubscribe: Subscription;

  constructor(
    private http : HttpClient,
    private toastrService: ToastrService,
    private activatedRoute : ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.parms_link = this.activatedRoute.snapshot.paramMap.get('link');
    this.parms_time = this.activatedRoute.snapshot.paramMap.get('time');
    this.api_url = 'auth/resetPassword/'+this.parms_link+'/'+this.parms_time;
  }

  // =============== Change Password form submit start ==========
onSubmitChangePassword(form:NgForm){
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

  this.formSubmitSubscribe = this.http.post(this.api_url, form.value).subscribe(
    (response:any) => {
      if(response.status === 200){
        this.toastrService.success(response.message);
        form.reset();
        this.isLoading = false;
        this.router.navigateByUrl('/home');
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
// Change Password  form submit end
}
