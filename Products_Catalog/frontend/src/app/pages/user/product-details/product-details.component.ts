import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  currentItem?: any;

  ngOnInit() {
    const item = localStorage.getItem('currentItem');
    if (item) {
      this.currentItem = JSON.parse(item);
    }
  }
}
