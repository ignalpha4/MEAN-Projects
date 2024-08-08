import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupplierService } from 'src/app/core/services/supplier.service';


@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.css']
})
export class SupplierFormComponent implements OnChanges {

  SuppForm !: FormGroup;

  @Input() editedSupp!:any;
  
  constructor(private fb:FormBuilder,private supplierService: SupplierService){
    this.initForm();
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes["editedSupp"] && changes["editedSupp"].currentValue){
      this.SuppForm.patchValue(this.editedSupp);
    }
  }

  initForm():void{
    this.SuppForm = this.fb.group({
      S_Name:['',Validators.required],
      S_Contact:['',Validators.required],
      S_Address:['',Validators.required]
    })
  }

  submit():void{
    const formData = this.SuppForm.value;

    this.supplierService.addSupplier(formData).subscribe((res:any)=>{
      if(res.status){
        alert(res.message);
        
    this.SuppForm.reset();
      }else{
        alert(res.message);
      }
    })



  }

}
