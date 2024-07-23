import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {


  constructor(private http: HttpClient) {}

  bookSeat(data: any): Observable<any> {
    return this.http.post<any>(`/booking`, data);
  }
  
}
