import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../../../classes/product';
import { ProductsService } from '../../../services/products.service';
declare var $: any;

@Component({
  selector: 'app-modal-cart',
  templateUrl: './modal-cart.component.html',
  styleUrls: ['./modal-cart.component.css']
})
export class ModalCartComponent implements OnInit, OnDestroy {
  
  public products : Product[] = [];
 
  constructor(private productsService: ProductsService,) { }

  ngOnInit() {
  	this.productsService.getProducts().subscribe(product => { 
  		this.products = product; 
  	});
  }

  ngOnDestroy() {
    $('.addTocartModal').modal('hide');
  }

  relatedProducts(pro) {
     var relatedItems = this.products.filter(function(products) {
        if(products.id != pro.id)
        return products.category == pro.category;
    });
    return relatedItems;   
  }

}
