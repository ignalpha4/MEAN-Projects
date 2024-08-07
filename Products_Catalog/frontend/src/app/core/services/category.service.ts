import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private localStorageKey :string= 'categories';

  private categoriesSubject = new BehaviorSubject<any[]>(this.getData());
  categories$ = this.categoriesSubject.asObservable();
  

  constructor(private http:HttpClient) {}

  private baseUrl: string = 'http://localhost:5000';

  addCategory(data:any):Observable<any>{
    return  this.http.post(`${this.baseUrl}/category/add`,data);
  }

  listCategory():Observable<any>{
    return this.http.get(`${this.baseUrl}/category/listCategories`);
  }


  getData(): any[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  addData(category: any): void {
    const categories = this.getData();
    const index = categories.findIndex((cat: any) => cat.C_Id === category.C_Id);

    if (index !== -1) {
      categories[index] = category; 
    } else {
      categories.push(category); 
    }

    localStorage.setItem(this.localStorageKey, JSON.stringify(categories));
    this.categoriesSubject.next(categories); 
  }

  deleteData(C_Id: number): void {
    const categories = this.getData();
    const updatedCategories = categories.filter((cat: any) => cat.C_Id !== C_Id);
    localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCategories));
    this.categoriesSubject.next(updatedCategories);
  }
}
