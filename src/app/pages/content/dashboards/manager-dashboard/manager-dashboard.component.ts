import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {IPlanSettings} from "@page/content/dashboards/manager-dashboard/components/plan-card/plan-card.component";
import {response} from "@page/content/dashboards/manager-dashboard/components/plan-card/test-response";
import { ManagerDashboardOptionsService } from '@app/core/services/manager-dashboard-options.service';
import { ChartClear, ChartDetailDataGet, ChartDetailGet } from '@app/store/actions/chart/chart.actions';

import { Store, select } from '@ngrx/store';
import * as appState from '@store/reducers/index';
import { take, takeUntil } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { MatTabChangeEvent } from '@angular/material/tabs';


@Component({
  selector: 'app-manager-dashboard',
  templateUrl: './manager-dashboard.component.html',
  styleUrls: ['./manager-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ManagerDashboardComponent implements OnInit {
  isPublished: boolean = true;
  isFiltersShowed: boolean = false;
  dashboardId: number;
  loading: any;
  // testPlanSettings: { [key: string]: IPlanSettings[] } = response;

  public selectedTab: number = 0;
  public chartDynamicOptions: any;
  public chartDecompositionOptions: any;
  public chartDecompositionTretiaryOptions: any;
  public chartRatingOptions: any;
  private _destroy$ = new Subject<null>();

  public shortTable: any;
  public fullTable: any;
  public leftPartTable: any;
  public rightPartTable: any;
  public completedListLeft: any;
  public completedListLeftNew: any;
  public completedListRight: any;
  public completedListLeftWithoutGroup: any = [];
  public completedListRating: any;
  public completedListTretiary: any;
  public completedListTretiaryWithoutGroup: any = [];

  public filterList: any = [];
  public filterSelected: any;
  public selectedIndicatorIndex: number;
  public selectedIndicatorIndexLeft: number;

  public onlyRedToggle: boolean = false;

  constructor(
    private managerDashboardService: ManagerDashboardOptionsService,
    private store: Store<appState.State>,
  ) { }

  ngOnInit(): void {
    this.store.dispatch(ChartDetailDataGet({ id: '1167', q: {} }));
    // this.store.dispatch(ChartDetailDataGet({ id: '1157', q: {} }));

    this.store.pipe(takeUntil(this._destroy$), select('chartDetailDataGet')).subscribe((res) => {
      // блок банковского дашборда
      if (res.data && res.id === '1167') {
        this.leftPartTable = res.data.result[0].data;
        this.completedListLeftNew = [];
        this.completedListLeftNew = this.processLeftPartNew(this.leftPartTable);
        this.store.dispatch(ChartDetailDataGet({ id: '1132', q: {} }));
      } else if  (res.data && res.id === '1132') {
        this.leftPartTable = [...res.data.result[0].data];
        this.completedListLeft = [];
        this.completedListLeftWithoutGroup = [];
        this.completedListLeft = this.processLeftPart(this.leftPartTable)
        for (let elem of this.completedListLeft) {
          this.completedListLeftWithoutGroup = this.completedListLeftWithoutGroup.concat(elem.data);
        }
        this.store.dispatch(ChartDetailDataGet({ id: '1219', q: {} }));
      } else if (res.data && res.id === '1131') {
        this.rightPartTable = res.data.result[0].data;
        this.completedListRight = this.processRightPart(this.rightPartTable);
        this.store.dispatch(ChartDetailDataGet({ id: '1133', q: {} }));
        this.selectedIndicatorIndex = 0;
        this.selectedIndicatorIndexLeft = 0;
        this.updateCharts([1, 2, 3, 4], this.selectedTab);
      } else if (res.data && res.id === '1133') {
        this.completedListRating = this.processRating( res.data.result[0].data)
        let selectedIndicator = this.completedListLeftWithoutGroup[this.selectedIndicatorIndexLeft];
        this.chartRatingOptions =
          this.managerDashboardService.configRatingChart(this.completedListRating[selectedIndicator.name], selectedIndicator.name, selectedIndicator.unit);

      } else if (res.data && res.id === '1219') {
        console.log(this.leftPartTable, res.data.result[0].data);

        this.leftPartTable = [ ...this.leftPartTable, ...res.data.result[0].data ];
        this.completedListLeft = [];
        this.completedListLeftWithoutGroup = [];
        this.completedListLeft = this.processLeftPart(this.leftPartTable);
        for (let elem of this.completedListLeft) {
          this.completedListLeftWithoutGroup = this.completedListLeftWithoutGroup.concat(elem.data);
        }
        this.store.dispatch(ChartDetailDataGet({ id: '1131', q: {} }));
      }

      // блок бизнес-линий
      if (res.data && res.id === '1157') {
        this.leftPartTable = res.data.result[0].data;
        this.completedListLeft = [];
        this.completedListLeftWithoutGroup = [];
        this.completedListLeft = this.processLeftPart(this.leftPartTable)
        for (let elem of this.completedListLeft) {
          this.completedListLeftWithoutGroup = this.completedListLeftWithoutGroup.concat(elem.data);
        }
        this.store.dispatch(ChartDetailDataGet({ id: '1158', q: {} }));
      }  else if (res.data && res.id === '1158') {
        this.rightPartTable = res.data.result[0].data;
        this.completedListRight = this.processRightPart(this.rightPartTable);
        this.store.dispatch(ChartDetailDataGet({ id: '1159', q: {} }));
        // this.updateCharts([1, 2, 3, 4], this.selectedTab);
      } else if (res.data && res.id === '1159') {

        this.completedListTretiary = this.processTretiaryIndicators(res.data.result[0].data);
        this.selectedIndicatorIndex = 0;
        this.selectedIndicatorIndexLeft = 0;
        this.updateCharts([1, 2, 3, 4], this.selectedTab);
      }
    });

  }

  setFavoriteStatus() {

  }

  publishDashboard() {

  }

  toggleOpenFilters() {
    this.isFiltersShowed = !this.isFiltersShowed;
  }

  onCopyLinkDashboardId(dashboardId: any) {

  }

  onOpenDialogSendDashboardToEmail(dashboardId: any) {

  }

  reloadDashboard() {

  }

  processSelect(event) {
    this.selectedIndicatorIndex = this.completedListRight?.findIndex(element => element.indicator === event);
    this.selectedIndicatorIndexLeft = this.completedListLeftWithoutGroup.findIndex(element => element.name === event);
    let selectedIndicator = this.completedListLeftWithoutGroup[this.selectedIndicatorIndexLeft];
    this.chartRatingOptions =
    this.managerDashboardService.configRatingChart(this.completedListRating[selectedIndicator.name], selectedIndicator.name, selectedIndicator.unit);
    if (this.filterSelected) {
      this.updateCharts([this.filterSelected], this.selectedTab);
    } else {
      this.updateCharts([1, 2, 3, 4], this.selectedTab);
    }
  }

  processFilter(event: any) {
    this.filterSelected = Number(event.timerange) + 1;
    this.filterList = event.filters;
    if (this.filterSelected) {

      this.updateCharts([this.filterSelected], this.selectedTab);
    } else {
      this.updateCharts([1, 2, 3, 4], this.selectedTab);
    }
  }

  processRating(array: any[]) {
    const res = {};
    array.forEach((elem) => {
      let indicatorIndex = Object.keys(res).findIndex(element => element === elem.indicator_name);
      if (indicatorIndex >= 0) {
        let indicatorName = Object.keys(res)[indicatorIndex];
        res[indicatorName].push(elem);
      } else {
        res[elem.indicator_name] = [elem];
      }
    });
    return res;
  }

  processLeftPart(array: any[]) {
    const res = [];
    array.forEach((elem) => {

      let resGroupElementIndex = res.findIndex(resElement => {
        return resElement.group === elem.group_name;
      });

      if (resGroupElementIndex !== -1) {
        let resGroupDataElementIndex = res[resGroupElementIndex].data.findIndex(element => element.name === elem.indicator_name);


        if (elem.zone ) {

          if (elem.zone === 'Красная зона') {
            res[resGroupElementIndex].data[resGroupDataElementIndex].max.push(elem.value);

          } else {
            res[resGroupElementIndex].data[resGroupDataElementIndex].min.push(elem.value);
          }
        } else if (resGroupDataElementIndex === -1) {
          res[resGroupElementIndex].data.push({
            group: elem.group_name,
            name: elem.indicator_name,
            unit: elem.unit_name,
            plan: parseFloat(elem.plan),
            fact: parseFloat(elem.fact),
            quarterPlan: [elem.plan],
            quarterFact: [elem.fact],
            min: [],
            max: [],
            efficiency: this.divideIfNotZero(elem.fact, elem.plan)
          })
        } else {
          res[resGroupElementIndex].data[resGroupDataElementIndex].plan += parseFloat(elem.plan) || 0;
          res[resGroupElementIndex].data[resGroupDataElementIndex].fact += parseFloat(elem.fact) || 0;
          res[resGroupElementIndex].data[resGroupDataElementIndex].quarterPlan
            .push(this.managerDashboardService.wholeInteger.includes(elem.indicator_name) ? Math.round(+elem.plan) : elem.plan);
          res[resGroupElementIndex].data[resGroupDataElementIndex].quarterFact
            .push(this.managerDashboardService.wholeInteger.includes(elem.indicator_name) ? Math.round(+elem.fact) : elem.fact);
          res[resGroupElementIndex].data[resGroupDataElementIndex].efficiency =
            this.divideIfNotZero(res[resGroupElementIndex].data[resGroupDataElementIndex].fact, res[resGroupElementIndex].data[resGroupDataElementIndex].plan)
        }
      } else {
        // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
        res.push({
          group: elem.group_name,
          full: false,
          data: [{
            group: elem.group_name,
            name: elem.indicator_name,
            unit: elem.unit_name,
            plan: elem.plan,
            fact: elem.fact,
            quarterPlan: [elem.plan],
            quarterFact: [elem.fact],
            min: [],
            max: [],
            efficiency: this.divideIfNotZero(elem.fact, elem.plan)
          }]
        })
      }
    });
    return res;
  }

  processLeftPartNew(array: any[]) {
    const res = [];
    array.forEach((elem) => {
      let resGroupElementIndex = res.findIndex(resElement => resElement.group === elem.group_name)
      if (resGroupElementIndex !== -1) {
        let resGroupDataElementIndex = res[resGroupElementIndex].data.findIndex(element => element.name === elem.indicator_name);
        if (resGroupDataElementIndex === -1) {
          // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
          res[resGroupElementIndex].data.push({
            name: elem.indicator_name,
            unit: elem.unit_name,
            plan: parseFloat(elem.plan),
            fact: parseFloat(elem.fact),
            efficiency: this.divideIfNotZero(elem.fact, elem.plan)
          })
        } else {
          res[resGroupElementIndex].data[resGroupDataElementIndex].efficiency =
            this.divideIfNotZero(res[resGroupElementIndex].data[resGroupDataElementIndex].fact, res[resGroupElementIndex].data[resGroupDataElementIndex].plan)
        }
      } else {
        // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
        res.push({
          group: elem.group_name,
          full: false,
          data: [{
            name: elem.indicator_name,
            unit: elem.unit_name,
            plan: elem.plan,
            fact: elem.fact,
            efficiency: this.divideIfNotZero(elem.fact, elem.plan)
          }]
        })
      }
    });
    return res;
  }

  processRightPart(array: any[]) {
    const res = [];
    array.forEach((elem) => {
      let resGroupElementIndex = res.findIndex(resElement => resElement.indicator === elem.indicator_name)
      if (resGroupElementIndex !== -1) {
        let resGroupDataElementIndex = res[resGroupElementIndex].data.findIndex(element => element.name === elem.sub_indicator_name);
        if (resGroupDataElementIndex === -1) {
          // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
          res[resGroupElementIndex].data.push({
            group: elem.group,
            name: elem.sub_indicator_name,
            unit: elem.unit_name,
            quarterPlan: [elem.plan],
            quarterFact: [elem.fact]
          });
        } else {
          res[resGroupElementIndex].data[resGroupDataElementIndex].quarterPlan.push(elem.plan);
          res[resGroupElementIndex].data[resGroupDataElementIndex].quarterFact.push(elem.fact);
        }
      } else {
        // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
        res.push({
          indicator: elem.indicator_name,
          group: elem.group_name,
          unit: elem.unit_name,
          data: [{
            group: elem.group,
            name: elem.sub_indicator_name,
            unit: elem.unit_name,
            quarterPlan: [elem.plan],
            quarterFact: [elem.fact],
          }]
        })
      }
    });
    return res;
  }

  processTretiaryIndicators(array) {
    const res = [];
    array.forEach((elem) => {
      let resGroupElementIndex = res.findIndex(resElement => resElement.indicator === elem.indicator_name)
      if (resGroupElementIndex !== -1) {
        let resGroupDataElementIndex = res[resGroupElementIndex].data.findIndex(element => element.name === elem.key_product_name);
        if (resGroupDataElementIndex === -1) {
          // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
          res[resGroupElementIndex].data.push({
            name: elem.key_product_name,
            unit: elem.unit_name,
            quarterPlan: [elem.plan],
            quarterFact: [elem.fact]
          });
        } else {
          res[resGroupElementIndex].data[resGroupDataElementIndex].quarterPlan.push(elem.plan);
          res[resGroupElementIndex].data[resGroupDataElementIndex].quarterFact.push(elem.fact);
        }
      } else {
        // let shortTableElement = this.shortTable.find(element => element.indicator_name === elem.indicator_name);
        res.push({
          indicator: elem.indicator_name,
          group: elem.group_name,
          unit: elem.unit_name,
          data: [{
            name: elem.key_product_name,
            unit: elem.unit_name,
            quarterPlan: [elem.plan],
            quarterFact: [elem.fact],
          }]
        })
      }
    });
    return res;
  }

  divideIfNotZero(numerator, denominator) {
    if (denominator === 0 || isNaN(denominator) || !denominator) {
          return null;
    }
    else {
          return numerator / denominator;
    }
  }

  groupBy(array: any[]): { [key: string]: any } {
    const res = {};
    array.forEach((item) => {
      Object.keys(item).forEach((key) => {
        res[key] = Array.isArray(res[key]) ? res[key] : [];
        res[key].push(item[key]);
      });
    });
    return res;
  }

  openFull(index) {
    this.completedListLeftNew[index].full = true;
    this.completedListLeft[index].full = true;
  }

  closeFull(index) {
    this.completedListLeftNew[index].full = false;
    this.completedListLeft[index].full = false;
  }

  updateCharts(filter, dashboardType: number) {
    this.chartDecompositionOptions =
    this.managerDashboardService.configDecompositionChart(
      this.completedListRight[this.selectedIndicatorIndex],
      filter,
      this.completedListLeftWithoutGroup[this.selectedIndicatorIndexLeft].unit);

    this.chartDynamicOptions =
    this.managerDashboardService.configDynamicChart(this.completedListLeftWithoutGroup[this.selectedIndicatorIndexLeft], filter, dashboardType);
    if (dashboardType === 1) {
      this.chartDecompositionTretiaryOptions =
      this.managerDashboardService.configDecompositionChart(
        this.completedListTretiary?.[this.selectedIndicatorIndex],
        filter,
        this.completedListLeftWithoutGroup[this.selectedIndicatorIndexLeft].unit);
    }
  }

  OnRedToggleChange() {
    this.onlyRedToggle = !this.onlyRedToggle;
    if (this.onlyRedToggle) {
      for (let elem of this.completedListLeft) {
        elem.full = true;
      }
    } else {
      for (let elem of this.completedListLeft) {
        elem.full = false;
      }
    }
  }

  changeTab(event: MatTabChangeEvent) {
    if (event.index === 0) {
      this.store.dispatch(ChartDetailDataGet({ id: '1132', q: {} }));
    } else if (event.index === 1) {
      this.store.dispatch(ChartDetailDataGet({ id: '1157', q: {} }));
    }
    this.selectedTab = event.index;
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();

    this.store.dispatch(ChartClear());
  }
}
