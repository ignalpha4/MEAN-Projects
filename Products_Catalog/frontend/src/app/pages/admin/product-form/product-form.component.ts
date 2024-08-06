import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICat } from 'src/app/core/interfaces/category.interface';
import { IProduct } from 'src/app/core/interfaces/product.interface';
import { ISupplier } from 'src/app/core/interfaces/supplier.interface';
import { CategoryService } from 'src/app/core/services/category.service';
import { ProductService } from 'src/app/core/services/product.service';
import { SupplierService } from 'src/app/core/services/supplier.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css'],
})
export class ProductFormComponent implements OnInit, OnChanges {
  form!: FormGroup;

  @Input() editProduct!: IProduct;

  categories: ICat[] = [];
  suppliers: ISupplier[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private productService: ProductService
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });

    this.supplierService.suppliers$.subscribe((suppliers) => {
      this.suppliers = suppliers;
    });
  }

  initForm() {
    this.form = this.fb.group({
      P_Id: ['', Validators.required],
      P_Name: ['', Validators.required],
      P_Category: ['', Validators.required],
      P_Price: ['', [Validators.required, Validators.min(0)]],
      P_Supplier: ['', Validators.required],
      P_Image: ['', Validators.required],
      P_Desc: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editProduct'] && changes['editProduct'].currentValue) {
      this.form.patchValue(this.editProduct);
    }
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ P_Image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = this.form.value;
    this.productService.addData(formData);
    this.form.reset();
  }
}
