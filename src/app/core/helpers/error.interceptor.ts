import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      console.log('ERRRROORORO!', err);

      if (err.status === 401 && !request.headers.has('Allow-401')) {
        this.authenticationService.logout();
        location.reload();
      }

      if (err.status === 422 || err.status === 401 || request.headers.has('Allow-Error')) {
        return throwError(err.error);
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
