import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { RazorpayService } from 'src/app/core/services/razorpay.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent {
  currentItem?: any;
  productID !:any ;
  productImageURL:any ='http://localhost:5000';

  constructor(private route:ActivatedRoute,private productService:ProductService,private razorPayService:RazorpayService){
    
    this.route.queryParams.subscribe((params:any)=>{
      this.productID = params['id'];

      console.log(this.productID);
      
      
    this.productService.getProductById(this.productID).subscribe((res:any)=>{
      this.currentItem = res.product[0];
      console.log(res.product);
      
    })

    })
  }

  buy(){
    let productPrice = this.currentItem.P_Price;
    this.razorPayService.payWithRazorpay(productPrice);
  }
}
