import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {


  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/listauthors`);
  }

  addAuthor(formdata:any):Observable<any>{
    return this.http.post<any>(`${this.apiUrl}/user/addauthor`,formdata)
  }

  updateAuthor(id:any,author:any):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}/user/updateauthor/${id}`,author);
  }

  deleteAuthor(id:any){
    return this.http.delete<any>(`${this.apiUrl}/user/deleteauthor/${id}`)
  }
}
