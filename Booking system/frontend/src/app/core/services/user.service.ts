import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  constructor(private http: HttpClient) {}

  getBuses(): Observable<any[]> {
    return this.http.get<any[]>(`/getBuses`);
  }
  
  getBusById(id:any):Observable<any>{
    return this.http.get<any>(`/getBusById/${id}`)
  }
  
  getFilteredBuses(from: string, to: string): Observable<any> {
    console.log(from,to);
    
    return this.http.get<any>(`/filteredBuses`, {
      params: { from, to }
    });
  }

}
