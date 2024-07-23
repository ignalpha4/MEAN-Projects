import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/listcategory`);
  }

  addCategory(formdata: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/addcategory`, formdata);
  }

  getCategoryById(_id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/getcategory/${_id}`);
  }

  updateCategory(_id: string, category: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/user/updatecategory/${_id}`, category);
  }

  deleteCategory(_id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/user/deletecategory/${_id}`);
  }
}
