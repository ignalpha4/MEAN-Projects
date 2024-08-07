import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  signup(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/signup`, user);
  }

  login(user:any):Observable<any>{
    return this.http.post(`${this.baseUrl}/user/login`,user);
  }


  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/getCurrentUser`);
  }

  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/getAllUsers`);
  }

  updateProfileImage(data: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/user/updateProfileImage`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
  
}
