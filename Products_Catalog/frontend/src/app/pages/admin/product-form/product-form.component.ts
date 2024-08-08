import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  @Input() editProduct!: any;

  categories: any[] = [];
  suppliers: any[] = [];

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private productService: ProductService
  ) {
    this.initForm();
  }

  ngOnInit() {

    this.categoryService.listCategory().subscribe((res:any)=>{
      this.categories = res.categories;
    })

    this.supplierService.listSuppliers().subscribe((res:any)=>{
      this.suppliers = res.suppliers;
    })
  }

  initForm() {
    this.form = this.fb.group({
      P_Name: ['', Validators.required],
      P_Category: ['', Validators.required],
      P_Price: ['', [Validators.required, Validators.min(0)]],
      P_Supplier: ['', Validators.required],
      P_Image: [''],
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ P_Image: file });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

  
    const formData = new FormData();
    Object.keys(this.form.controls).forEach(key => {
      formData.append(key, this.form.get(key)?.value);
    });

    
    this.productService.addProduct(formData).subscribe((res:any)=>{
      if(res.status){
        alert(res.message);
        this.form.reset();

      }else{
        alert(res.message);
      }
    })
    
  }
}
