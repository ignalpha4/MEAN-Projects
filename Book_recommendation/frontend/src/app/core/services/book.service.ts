import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/listbooks`);
  }

  addBook(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/user/addbook`,formdata)
  }

  updateBook(id:any,book:any):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}/user/updatebook/${id}`,book);
  }

  deleteBook(id:any){
    return this.http.delete<any>(`${this.apiUrl}/user/deletebook/${id}`)
  }
  
}
