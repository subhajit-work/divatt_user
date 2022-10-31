import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { LoginService } from './auth.service';
import { CommonUtils } from '../common-utils/common-utils';

/* tslint:disable */
@Injectable({
  providedIn: 'root'
})
// CanLoad is need for befor module loaded it check auth true or false
export class AuthGuard implements CanActivate {

  // variable
  get_path_name;

  constructor(
    private authService: LoginService,
    private router: Router,
    private commonUtils: CommonUtils
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.currentUserValue) {      
      return true;
    }
    else{
      this.router.navigate(['/home']);
      // this.router.navigate(['/home'], { queryParams: { returnUrl: state.url }});
      return false;
    }
    
  
    // const currentUser = this.authService.globalparamsData;
    // console.log('currentUser',currentUser);
    
    // if (currentUser) {
    //     // authorised so return true
    //     return true;
    // }

    // // not logged in so redirect to login page with the return url
    // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    // return false;
  }
}