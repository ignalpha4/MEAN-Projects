
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.scss']
})
export class ViewProductsComponent {

  filterForm!: FormGroup;
  searchKey: string = '';
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];

  constructor(private productService: ProductService,private categoryService: CategoryService,private router: Router,private fb: FormBuilder) {
    this.initForm();
    this.productService.products$.subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    });
    this.categoryService.categories$.subscribe(categories => {
      this.categories = categories;
    });
  }

  initForm() {
    this.filterForm = this.fb.group({
      category: ['', Validators.required],
      filterPrice: ['', Validators.required]
    });
  }

  onFilterSelect() {
    const selectedCategory = this.filterForm.get('category')?.value;
    if (selectedCategory === '') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.P_Category.includes(selectedCategory)
      );
    }
  }

  onPriceFilterSelect(){
    const selectedPrice = this.filterForm.get('filterPrice')?.value;

    console.log("inside price filter");
    
    if(selectedPrice ===''){
      this.filteredProducts = this.products;
      console.log('insied empty');
    }
    else if(selectedPrice==='below100'){
      this.filteredProducts = this.products.filter(product=>product.P_Price<100);
    }
    else if(selectedPrice==='between100to500'){
      this.filteredProducts = this.products.filter(product=>product.P_Price>=100 && product.P_Price<=500);
    }
    else if(selectedPrice==='above500'){
      this.filteredProducts = this.products.filter(product=>product.P_Price>500);
    }
  }

  updateResults() {
    this.filteredProducts = this.products.filter(product =>
      product.P_Name.toLowerCase().includes(this.searchKey.toLowerCase()) ||
      product.P_Category.toLowerCase().includes(this.searchKey.toLowerCase())
    );
  }

  viewProduct(product: any) {
    localStorage.setItem('currentItem', JSON.stringify(product));
    this.router.navigate(['pages/user/dashboard/product-details']);
  }
}
