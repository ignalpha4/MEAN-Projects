import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/core/interfaces/product.interface';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  currentItem?: IProduct;

  ngOnInit() {
    const item = localStorage.getItem('currentItem');
    if (item) {
      this.currentItem = JSON.parse(item);
    }
  }
}
