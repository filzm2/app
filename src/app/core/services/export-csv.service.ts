import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ExportCsvService {
  constructor() {}

  // TODO избавиться от фиксированных ключей. как?
  //  значениям нужно давать осмысленные имена, сейчас это просто name и в имено может быть число...
  onExportCSV(
    chartId: number,
    item: string,
    chartsDatasComplete: any,
    chartsDatasCompleteForTabs?: any
  ): any {
    let data = chartsDatasComplete[chartId] || chartsDatasCompleteForTabs[chartId];

    if (!data) {
      return;
    }

    data = this.getClearedData(data);
    // console.log(data.chartType, data.data.data);

    const chartsForKeyValues = ['bubble', 'big_number_total', 'sunburst', 'bar', 'dist_bar'];

    if (data.chartType === 'sankey') {
      return this.createCSVForChartСollect(data, item, 'product_name', 'rate');
    } else if (data.chartType === 'echarts_timeseries') {
      return this.createCSVForChartEchartsTimeseries(data, item);
    } else if (data.chartType === 'pie') {
      return this.createCSVForChartPie(data, item);
    } else if (chartsForKeyValues.includes(data.chartType)) {
      return this.createCSVForChartKeyValue(data, item);
    } else if (data.chartType === 'bar_stacked_plan') {
      return this.createCSVForChartСollectBarStackedPlan(data, item, 'activity_fied', [
        'SUM(contract_qty)',
        'SUM(contract_amt)',
      ]);
    } else {
      console.log(
        'onExportCSV() / Данный график не обработан! Добавьте для него функционал!',
        'chartType:',
        data.chartType,
        data.data.data
      );
    }
  }

  private getClearedData(data) {
    if (data.chartType === 'bar') {
      const keysForDelete = ['itemStyle', 'emphasis'];

      data.data.data = data.data.data.filter((d) => {
        keysForDelete.forEach((key: string) => {
          if (d[key]) {
            delete d[key];
          }
        });

        return d;
      });
    }

    return data;
  }

  createCSVForChartСollect(
    data: any,
    item: string,
    keyItem: string,
    valueItem: string
  ): Array<any> {
    const result: Array<Array<string | number>> = [];
    let csvTitle = '';

    Object.keys(data.data.data[0]).forEach((key: string): void => {
      csvTitle += `${key},`;
    });

    csvTitle = csvTitle.slice(0, -1);
    csvTitle += '\n';

    data.data.data.reduce((res: object, value: any): object => {
      if (!res[value[keyItem]]) {
        res[value[keyItem]] = [value[keyItem], 0];
        result.push(res[value[keyItem]]);
      }
      res[value[keyItem]][1] += value[valueItem];
      return res;
    }, {});

    return [csvTitle, item, result];
  }

  // TODO складывать значения для двух неизвестных имени столбца. как то определять, куда и что складывать.
  // сейчас нет считает для ключа COUNT(rate)
  // createCSVForChartСollect(data: any, item: string): Array<any> {
  //   const result: Array<Array<string | number>> = [];
  //   let csvTitle = '';

  //   Object.keys(data.data.data[0]).forEach((key: string): void => {
  //     csvTitle += `${key},`;
  //   });

  //   csvTitle = csvTitle.slice(0, -1);
  //   csvTitle += '\n';

  //   data.data.data.reduce((res: object, obj: any): object => {
  //     Object.keys(obj).forEach((key: string): void => {
  //       // console.log(obj[key], res);
  //       const valueString = `${obj[key]}`;
  //       console.log('valueString', valueString);

  //       if (typeof obj[key] === 'string' && !res[valueString]) {
  //         res[valueString] = [obj[key], 0, 0];
  //         result.push(res[valueString]);
  //       } else if (typeof obj[key] === 'number') {
  //         res[valueString][1] += obj[key];
  //       }

  //       console.log(res[valueString]);
  //       // console.log(obj[key]);
  //     });

  //     return res;
  //   }, {});

  //   return [csvTitle, item, result];
  // }

  createCSVForChartСollectBarStackedPlan(
    data: any,
    item: string,
    keyItem: string,
    valueItem: Array<string>
  ): Array<any> {
    const result: Array<Array<string | number>> = [];

    data.data.data.reduce((res: object, value: any): object => {
      if (!res[value[keyItem]]) {
        res[value[keyItem]] = [value[keyItem], 0];
        result.push(res[value[keyItem]]);
      }

      valueItem.forEach((str: string) => {
        if (value[str]) {
          res[value[keyItem]][1] += value[str];
        }
      });

      return res;
    }, {});

    const csvTitle = '';
    return [csvTitle, item, result];
  }

  createCSVForChartKeyValue(data: any, item: string): Array<any> {
    const result: Array<Array<string | number>> = [];
    let csvTitle = '';

    data.data.data.forEach((val: object): void => {
      Object.keys(val).forEach((key: string): void => {
        if (!key.includes('timestamp')) {
          csvTitle += `${key},${val[key]}\n`;
        }
      });
    });

    return [csvTitle, item, result];
  }

  createCSVForChartPie(data: any, item: string): Array<any> {
    const result: Array<Array<string | number>> = [];
    let csvTitle = '';

    data.data.data.forEach((val: object): void => {
      Object.keys(val).forEach((key: string): void => {
        csvTitle += `${val[key]},`;
      });

      csvTitle = csvTitle.slice(0, -1);
      csvTitle += '\n';
    });

    return [csvTitle, item, result];
  }

  createCSVForChartEchartsTimeseries(data: any, item: string): Array<any> {
    const result: Array<Array<string | number>> = [];
    let csvTitle = '';

    Object.keys(data.data.data[0]).forEach((key: string): void => {
      if (!key.includes('timestamp')) {
        csvTitle += `${key},`;
      }
    });

    csvTitle = csvTitle.slice(0, -1);
    csvTitle += '\n';

    data.data.data.forEach((val: object): void => {
      Object.keys(val).forEach((key: string): void => {
        if (!key.includes('timestamp')) {
          csvTitle += `${val[key]},`;
        }
      });

      csvTitle = csvTitle.slice(0, -1);
      csvTitle += '\n';
    });

    return [csvTitle, item, result];
  }
}
