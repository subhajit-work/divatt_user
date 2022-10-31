import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import * as $ from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class LoginNavService {

  constructor(@Inject(DOCUMENT) private document: Document) { }
  
  // Add or Remove class
  public addNavLogin() {
    this.document.getElementById("logiSidenav").classList.add('open-side');

    this.document.getElementById("logiSidenav").classList.remove('forgotpassword');
    this.document.getElementById("logiSidenav").classList.remove('register');
    this.document.getElementById("logiSidenav").classList.remove('changepassword');
  }

  public addNavRegister() {
    this.document.getElementById("logiSidenav").classList.add('register');

    this.document.getElementById("logiSidenav").classList.remove('forgotpassword');
    this.document.getElementById("logiSidenav").classList.remove('changepassword');
  }
  public addNavchangepassword() {
    this.document.getElementById("logiSidenav").classList.add('changepassword');
    this.document.getElementById("logiSidenav").classList.add('open-side');

    this.document.getElementById("logiSidenav").classList.remove('forgotpassword');
    this.document.getElementById("logiSidenav").classList.remove('register');
  }
  public addNavforgotpassword() {
    this.document.getElementById("logiSidenav").classList.add('forgotpassword');
    this.document.getElementById("logiSidenav").classList.add('open-side');
  }
  public removeNavLogin() {
    this.document.getElementById("logiSidenav").classList.remove('open-side');
    this.document.getElementById("logiSidenav").classList.remove('register');
    this.document.getElementById("logiSidenav").classList.remove('changepassword');
    this.document.getElementById("logiSidenav").classList.remove('forgotpassword');
  }

}
