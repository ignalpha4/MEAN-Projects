import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  private localStorageKey:string = "suppliers"
  private suppliersSubject = new BehaviorSubject<any[]>(this.getData());
  suppliers$ =this.suppliersSubject.asObservable();

  constructor(private http:HttpClient) { }

  private baseUrl: string = 'http://localhost:5000';

  getData():any[]{
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }



  addSupplier(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/supplier/add`,data);
  }

  listSuppliers():Observable<any>{
    return this.http.get(`${this.baseUrl}/supplier/listSuppliers`);
  }

  deleteSupplier(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/supplier/delete/${id}`);
  }


  addData(supplier :any):void{
    const suppliers = this.getData();

    const index = suppliers.findIndex((sup:any)=>sup.S_Id === supplier.S_Id);

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
    const updatedSuppliers = suppliers.filter((sup:any)=>sup.S_Id !==S_Id);
    localStorage.setItem(this.localStorageKey,JSON.stringify(updatedSuppliers));
    this.suppliersSubject.next(updatedSuppliers);
  }
  
}
