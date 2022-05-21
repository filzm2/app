import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IDashboardDatasource } from '@page/content/dashboards/dashboards.interface';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { IChartDatasource } from '@page/content/charts/chart.interface';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardCardComponent implements OnInit {
  @Input() dashboard: IDashboardDatasource | IChartDatasource;
  @Input() permissions: { canRead: boolean; canWrite: boolean };
  @Input() pinned: { id: number; pin: boolean } = { id: -1, pin: false };
  @Input() isChart: boolean = false;
  @Output() setFavorite: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() delete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() export: EventEmitter<boolean> = new EventEmitter<boolean>();

  public thumbnail$: Observable<SafeUrl>;
  private defaultThumbnail: SafeUrl;

  constructor(private router: Router, private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.defaultThumbnail = this.sanitizer.bypassSecurityTrustUrl(
      this.isChart ? '/assets/chart.png' : '/assets/dashboard.png'
    );
    this.thumbnail$ = of(this.defaultThumbnail);
    if (this.dashboard?.thumbnail_url) {
      this.thumbnail$ = this.http.get(this.dashboard?.thumbnail_url, { responseType: 'blob' }).pipe(
        map((data) => {
          if (data.type !== 'application/json') {
            const url = window.URL.createObjectURL(data);
            return this.sanitizer.bypassSecurityTrustUrl(url);
          }
          return this.defaultThumbnail;
        })
      );
    }
  }

  public editDashboard(dashboard: IDashboardDatasource | IChartDatasource): void {
    this.router
      .navigate([this.isChart ? '/main/charts/edit' : '/main/dashboard/edit', dashboard.id])
      .then();
  }

  public exportDashboard(): void {
    this.export.emit(true);
  }

  public deleteDashboard(): void {
    this.delete.emit(true);
  }

  public setFavoriteStatus($event): void {
    $event.stopPropagation();
    this.setFavorite.emit(true);
  }

  getTitle(): string {
    return this.isChart
      ? (this.dashboard as IChartDatasource).slice_name
      : (this.dashboard as IDashboardDatasource).dashboard_title;
  }
}
