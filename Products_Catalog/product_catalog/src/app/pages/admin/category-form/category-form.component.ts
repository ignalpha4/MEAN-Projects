import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICat } from 'src/app/core/interfaces/category.interface';
import { CategoryService } from 'src/app/core/services/category.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnChanges {
  Cat_Form!: FormGroup;

  @Input() editCat!: ICat;

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
      C_Id: ['',Validators.required],
      C_Name: ['',Validators.required],
    });
  }

  submit(): void {
    const formData = this.Cat_Form.value;
    this.categoryService.addData(formData);
    this.Cat_Form.reset();
  }
}
