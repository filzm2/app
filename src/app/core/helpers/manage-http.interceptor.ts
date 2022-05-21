import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router, ActivationEnd, NavigationEnd } from '@angular/router';
import { HttpCancelService } from '../services/http-cancel.service';
import { takeUntil } from 'rxjs/operators';

@Injectable()
export class ManageHttpInterceptor implements HttpInterceptor {

    constructor(router: Router,
        private httpCancelService: HttpCancelService) {
            router.events.subscribe(event => {
                // An event triggered at the end of the activation part of the Resolve phase of routing.
                if (event instanceof NavigationEnd) {
                  // отменяем только запросы на dashboards/edit, иначе ломаются некоторые страницы
                  if (event.url.includes('dashboards/edit')) {
                    this.httpCancelService.cancelPendingRequests();
                  }
                }
            });
    }

    intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
      return next.handle(req).pipe(takeUntil(this.httpCancelService.onCancelPendingRequests()))
    }
}
