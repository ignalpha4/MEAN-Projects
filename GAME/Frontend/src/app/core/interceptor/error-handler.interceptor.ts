import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private toastr:ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred. Please try again.';
 
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error?.error.message}`;
        } else {
          errorMessage = error?.error.details || error?.error.message || error?.statusText || `Error Code: ${error?.status}` || error?.error;
        }
 
        this.toastr.error(errorMessage);
        console.error('Error Intercepted:', error);

        console.log(errorMessage);
        
        return throwError(errorMessage);
      })
    );
  }

  

}
