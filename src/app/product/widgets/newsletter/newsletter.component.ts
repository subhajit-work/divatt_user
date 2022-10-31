import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	if(localStorage.getItem('entryState') != 'newsletter'){
  		$('.newsletterm').modal('show');
  		localStorage.setItem('entryState','newsletter');
  	}
  }

}
