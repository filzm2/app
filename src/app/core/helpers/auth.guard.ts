import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, ActivatedRoute } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthService,
        private activatedRoute: ActivatedRoute
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;
        if (Object.keys(currentUser).length) {
            // logged in so return true
            return true;
        }

        console.log('! not logged in so redirect to login page with the return url');
        if (location.search) {
          const [, shortDashboardId, shortChartId] = location.search.match(/^\?c=(\d+):(\d+)$/) ?? []; // ex: c=19:269
          if (shortDashboardId) {
            this.router.navigate(['/login/'], { queryParams: { c: `${shortDashboardId}:${shortChartId}` } }).then();
            return false;
          }
        }
        console.log(this.activatedRoute);
        if (!this.authenticationService.redirectLink) {
          let params = {};
          if (location.search) {
            const rawString = location.search.replace('?', '');
            const arr = rawString.split('&');
            arr.map(item => {
              const raw = item.split('=');
                params[raw[0]] = raw[1];
            });
          }
          this.authenticationService.redirectLink = [location.pathname, params];
        }
        this.router.navigate(['/login/']).then();
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authenticationService.currentUserValue;

        if (Object.keys(currentUser).length) {
            // logged in so return true
            return true;
        }

        console.log('? not logged in so redirect to login page with the return url');
        this.router.navigate(['/login']);
        return false;
    }
}
