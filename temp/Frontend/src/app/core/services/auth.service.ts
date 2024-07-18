import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  
  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  signup(formData:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/signup`,formData);
  }

  login(formdata:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, formdata);
  }

  getUsers():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/user/listusers`);
  }

  getCurrentUser():Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/user/currentuser`);
  }

  updateProfileImage(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/user/updateProfileImage`, data);
  }

  updateUser(id:any,data:any):Observable<any>{
    return this.http.patch<any>(`${this.apiUrl}/user/updateUser/${id}`,data);
  }

  deleteUser(id:any):Observable<any>{
    return this.http.delete<any>(`${this.apiUrl}/user/deleteUser/${id}`)
  }

}
