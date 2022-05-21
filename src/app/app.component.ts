import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'exd-app';

  constructor(private authenticationService: AuthService, private router: Router) {}

  ngOnInit() {
    moment.locale('ru');

    // this.showConfig();
    // this.authenticationService.checkUser();
    // this.authenticationService.refresh();
    this.goToChartId();
  }

  goToChartId(): void {
    if (location.search) {
      const searchParams = new URLSearchParams(location.search);
      const shortLink = searchParams.get('c'); // example: c=19:269 | c=19

      if (shortLink) {
        const [dashboardId, chartId] = shortLink.split(':');
        /* @ts-ignore */
        window.dashboardIdChartId = chartId;
        this.router.navigate([`/main/dashboard/${dashboardId}`]);
      }
    }
  }
}
