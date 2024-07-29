import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }


  getAllGamesDetails():Observable<any>{
    return  this.http.get(`${this.apiUrl}/user/getAllGameDetails`)
  }

}
