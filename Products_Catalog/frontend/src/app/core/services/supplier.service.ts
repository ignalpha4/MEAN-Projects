import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ISupplier } from '../interfaces/supplier.interface';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private localStorageKey:string = "suppliers"
  private suppliersSubject = new BehaviorSubject<any[]>(this.getData());
  suppliers$ =this.suppliersSubject.asObservable();

  constructor() { }

  getData():ISupplier[]{
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  addData(supplier :ISupplier):void{
    const suppliers = this.getData();

    const index = suppliers.findIndex((sup:ISupplier)=>sup.S_Id === supplier.S_Id);

    if(index!==-1){
      suppliers[index]=supplier;
    }else{
      suppliers.push(supplier);
    }

    localStorage.setItem(this.localStorageKey,JSON.stringify(suppliers));
    this.suppliersSubject.next(suppliers); 

  }

  deleteData(S_Id:number):void{
    const suppliers = this.getData();
    const updatedSuppliers = suppliers.filter((sup:ISupplier)=>sup.S_Id !==S_Id);
    localStorage.setItem(this.localStorageKey,JSON.stringify(updatedSuppliers));
    this.suppliersSubject.next(updatedSuppliers);
  }
  
}
