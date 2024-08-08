import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/core/services/category.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnChanges {
  Cat_Form!: FormGroup;

  @Input() editCat!: any;

  constructor(private fb: FormBuilder, private categoryService:CategoryService) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editCat'] && changes['editCat'].currentValue) {
      this.Cat_Form.patchValue(this.editCat);
    }
  }

  initForm(): void {
    this.Cat_Form = this.fb.group({
      C_Name: ['',Validators.required],
    });
  }

  submit(): void {
    const formData = this.Cat_Form.value;

    this.categoryService.addCategory(formData).subscribe((res:any)=>{
      if(res.status){
        alert(res.message);
        this.Cat_Form.reset();
      }else{
        alert(res.message);
      }
    })

  }
}
