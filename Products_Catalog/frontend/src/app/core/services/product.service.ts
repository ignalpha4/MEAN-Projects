import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private localStorageKey ="products"

  private productsSubject = new BehaviorSubject<any[]>(this.getData());
  products$=this.productsSubject.asObservable();

  
  private baseUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  addProduct(data:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/products/add`,data);
  }

  listProducts():Observable<any>{
    return this.http.get(`${this.baseUrl}/products/listProducts`)
  }

  getProductById(id:any):Observable<any>{

    console.log(id,"from service");
  
    return this.http.get(`${this.baseUrl}/products/productById/${id}`)
  }

  deleteProduct(id:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/products/delete/${id}`);
  }

  getData():any[]{
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data):[];
  }

  addData(product:any):void{
    const products =this.getData();

    const index = products.findIndex((prod:any)=>prod.P_Id ===product.P_Id)

    if(index!==-1){
      products[index] =product;
    }else{
      products.push(product);
    }

    localStorage.setItem(this.localStorageKey,JSON.stringify(products));
    this.productsSubject.next(products);
  }

  deleteData(P_Id:number):void{
      const products = this.getData();

      const updatedProducts = products.filter((pro:any)=>pro.P_Id!==P_Id);

      localStorage.setItem(this.localStorageKey,JSON.stringify(updatedProducts));

      this.productsSubject.next(updatedProducts);
  }
}



