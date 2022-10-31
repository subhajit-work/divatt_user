import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-box-compare',
  templateUrl: './product-box-compare.component.html',
  styleUrls: ['./product-box-compare.component.css']
})
export class ProductBoxCompareComponent implements OnInit {
  allcompareproduct: any;

  constructor() { }

  ngOnInit() {
    this.allcompareproduct= JSON.parse(localStorage.getItem("compareItem"));
    console.log(this.allcompareproduct);
    // console.log(this.allcompareproduct[0].size);
    
  }

}
