import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    
    let headers = req.headers;  

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const clonedRequest = req.clone({ headers });
    
    return next.handle(clonedRequest);
  }
}
