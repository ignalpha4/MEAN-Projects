  import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';
import { ICat } from '../interfaces/category.interface';

  @Injectable({
    providedIn: 'root'
  })
  export class CategoryService {

    private localStorageKey :string= 'categories';

    private categoriesSubject = new BehaviorSubject<any[]>(this.getData());
    categories$ = this.categoriesSubject.asObservable();
    

    constructor() {}

    getData(): ICat[] {
      const data = localStorage.getItem(this.localStorageKey);
      return data ? JSON.parse(data) : [];
    }

    addData(category: ICat): void {
      const categories = this.getData();
      const index = categories.findIndex((cat: ICat) => cat.C_Id === category.C_Id);

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
      const updatedCategories = categories.filter((cat: ICat) => cat.C_Id !== C_Id);
      localStorage.setItem(this.localStorageKey, JSON.stringify(updatedCategories));
      this.categoriesSubject.next(updatedCategories);
    }
  }
