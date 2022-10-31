import { Component, OnInit, Input } from '@angular/core';
import { Product } from '../../classes/product';

@Component({
  selector: 'app-product-slider',
  templateUrl: './product-slider.component.html',
  styleUrls: ['./product-slider.component.css']
})
export class ProductSliderComponent implements OnInit {
  
  @Input() products: Product;
   
  constructor() { }

  ngOnInit() { }
  
  // Slick slider config
  public productSlideConfig: any = {
    infinite: true,
    speed: 300,
    slidesToShow: 6,
    slidesToScroll: 6,
    autoplay: true,
    dots:true,
    autoplaySpeed: 3000,
    nextArrow:"<div class='nav-btn next-slide fa fa-angle-right'></div>",
    prevArrow:"<div class='nav-btn prev-slide fa fa-angle-left'></div>",
    responsive: [{
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          dots:false,
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          dots:false,
        }
      },
      
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          dots:false,
        }
      },
      {
        breakpoint: 427,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          arrows:false,
          dots:false,
        }
      }
    ]
  };

}
