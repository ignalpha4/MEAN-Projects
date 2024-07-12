import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  signup(formData:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/signup`,formData);
  }

  authorSignup(formData:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/authorSignup`,formData);
  }

  login(formdata:any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/user/login`, formdata);
  }
}

//object
//
