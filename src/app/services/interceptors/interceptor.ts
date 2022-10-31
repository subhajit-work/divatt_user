import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, shareReplay, retry, map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { LoginService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';
import { CommonUtils } from '../common-utils/common-utils';
import { ToastrService } from 'ngx-toastr';

const API_URL = environment.apiUrl;
const API_MASTER = environment.apiMaster;

/* tslint:disable */ 
@Injectable()
export class InterceptorProvider implements HttpInterceptor {
  isparams = false;

  constructor(
    private router: Router,
    private authService : LoginService,
    private commonUtils: CommonUtils,
    private toastrService: ToastrService
) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authorization;
    // Keeps the original request params. as a new HttpParams
    let newParams = new HttpParams({fromString: request.params.toString()});
  
    /* const glabalParms = this.storage.get('setStroageGlobalParamsData');
    Promise.all([glabalParms]).then((arrayOfResults) => {
      console.log('arrayOfResults>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> >', arrayOfResults[0]);
      newParams = newParams.append('token', arrayOfResults[0].token);
      newParams = newParams.append('session', arrayOfResults[0].sission1);
      newParams = newParams.append('master', arrayOfResults[0].master1); 
    }); */

   
    let get_global_params = this.authService.getTokenSessionMaster();
    console.log('get_global_params intercepter >>>>>>>>>>>>>>>>', get_global_params);

    if(get_global_params == null ){
      // get Site Info
      this.commonUtils.getSiteInfoObservable.subscribe(res =>{
        // console.log('res interseptor id LOGOUT ===================>>>>>>', res);
        if(res){
          // get_global_params.master = res.id;
          newParams = newParams.append('master',res.id); 
        }
      })
      // get_global_params.master = API_MASTER;
    }

    // if(get_global_params != null && get_global_params.token !== undefined &&get_global_params.session !== undefined && get_global_params.master !== undefined){
    if(get_global_params == null || get_global_params.token == null){
      authorization = 'Bearer '
      console.log('appkey false');
    }else {
      authorization = 'Bearer '+get_global_params.token;
    }
    

    // Clone the request with params instead of setParams
    const requestClone = request.clone({
      url: `${API_URL}/${request.url}`,
      setHeaders: {
        'Authorization': authorization,
      }
    });
  
    // return next.handle(requestClone);
    return next.handle(requestClone).pipe(
      map((event: HttpEvent<any>) => {
        let eventUrl;
        if (event instanceof HttpResponse) {
          // const apiReq = request.clone({ url: `${this.baseUrl}/${request.url}` });
          // this.cache.set(request.url, event);
          /* req.clone({ 
            url: environment.serverUrl + request.url 
          }); */

          // let eventUrl = event.clone({ 
          //   url: API_URL + event.url 
          // });
          // console.log('interceptor return status >>>>', event.body.return_status);

          if(event.body.return_status == 0){
            //this.router.navigateByUrl('/auth');
            // this.authService.logout();
            // this.commonUtils.presentToast('error', event.body.return_message);
          }

          // this.toastrService.error(event.body.message);
          
          //token expire check
          if(event.body.return_token_expire){
            //this.router.navigateByUrl('/auth');
            this.authService.logout();
          }

          //show return_message
          if(!event.body.return_token_expire){
            // this.commonUtils.presentToast('info', event.body.return_message);
          }

        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {

        // this.router.navigateByUrl('/auth');

        console.log("interceptor error handeller >>", error);

        /* const code = error;
        let message = 'Could not sign you up, please try again.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address exists already!';
        } else if (code === 'EMAIL_NOT_FOUND') {
          message = 'E-Mail address could not be found.';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'This password is not correct.';
        }
        this.showAlert(message); */
        if (error.error.statuss == 500 && error.error.messagee == 'The Token Has Been Expired') {
          this.authService.logout();
        }

        if (error.status === 0) {
          // this.toastrService.error(error.message);
          /* this.router.navigateByUrl('/auth');
          console.log('<< please check your network connection! >>'); */
        }else if(error.status === 404){
          // this.toastrService.error(error.message);
        }else if(error.status === 500){
          this.toastrService.error('Internal Server Error');
          /* this.commonUtils.presentToast('success', 'Internal Server Error');
          this.commonUtils.presentToast('info', 'Internal Server Error'); */
        }else if(error.status === 401){
          this.toastrService.error(error.message);
          this.authService.logout();
          this.router.navigateByUrl('/auth');
        }
        // else {
        //   if(error.error.messagee) {
        //     this.toastrService.error(error.error.messagee);
        //   }else {
        //     this.toastrService.error(error.error.message);
        //   }
          
        //   console.log('else Part');
          
        // }
        return throwError(error);
      }));
  }

  /* async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      showCloseButton: true,
      animated:true,
      cssClass:"my-tost-custom-class",
      translucent: true,
      duration: 2000
    });
    toast.present();
  } */
  
  }

  
