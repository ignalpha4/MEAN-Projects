import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  createRoute(data: any): Observable<any> {
    return this.http.post<any>(`/create`, data);
  }

  addBus(data:any):Observable<any>{
    return this.http.post<any>(`/add`,data);
  }

  getRoutes(): Observable<any> {
    return this.http.get<any>(`/getRoutes`);
  }

  getRouteById(routeId:string):Observable<any>{
    return this.http.get<any>(`/getRouteById/${routeId}`)
  }

  getAvailableSeats(busId: string, date: string) {
    return this.http.get(`/availableSeats/${busId}/${date}`);
  }

  updateSeatStatus(seatId: string,gender:string) {
    return this.http.post(`/updateSeatStatus`, { seatId,gender });
  }
  addSeats(busId: any, totalSeats: any,date:any) {
    return this.http.post(`/addSeats`, { busId, totalSeats,date });
  }
}
