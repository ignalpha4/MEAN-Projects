import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:5000';

  createGame(gameData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/games`, gameData);
  }

  getGame(gameId: string): Observable<any> {
    console.log(gameId);
    return this.http.get(`${this.apiUrl}/user/games/${gameId}`);
  }

  makeMove(gameId: string, row: number, col: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/games/move`, { gameId, row, col });
  }

}
