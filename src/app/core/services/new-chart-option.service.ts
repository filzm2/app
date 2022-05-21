import { Injectable } from '@angular/core';
import { ShortNumberPipe } from '@app/pipes/short-number.pipe';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { IChartConfigData } from '@core/services/chart-option.service';
import moment from 'moment';
import {data} from "yandex-maps";

@Injectable({
  providedIn: 'root',
})
export class NewChartOptionService {
  public chartTypeDict: any = {
    dist_bar: 'bar',
    bar: 'bar',
    histogram: 'bar',
    bar_stacked: 'bar_stacked',
    bar_stacked_plan: 'bar_stacked_plan',
    echarts_timeseries: 'bar',
    treemap: 'treemap',
    pie: 'pie',
    sankey: 'sankey',
    line: 'line',
    big_number: 'big_number',
    big_number_total: 'big_number_total',
    bubble: 'bubble',
    table: 'table',
    sunburst: 'sunburst', // временное название, нужен был любой график-заглушка для хранения цифр плана/факта
  };

  public colorPalette: Array<string> = ['#F96300', '#3C91E6', '#FF9F1C', '#E3170A', '#017AFF'];
  public colorPaletteSankey: Array<string> = [
    '#3C91E6',
    '#FF9F1C',
    '#41EAD4',
    '#E3170A',
    '#6C47FF',
    '#39C0C8',
    '#FA893F',
    '#F34971',
    '#FF9382',
    '#F5C900',
  ];

  constructor(private shortPipe: ShortNumberPipe) {}

  // основная функция, на выходе которой получаем объект chartOptions для echarts
  // или объект с данными для текстового отображения
  // в функциях типа create***() производится обработка данных для соответствующего типа графика,
  // задание стилей, размера шрифтов и тд
  configChart(data: IChartConfigData): any {
    if (this.chartTypeDict[data.chartType] === 'big_number_total') {
      return this.createBigNumber(data);
    }

    if (this.chartTypeDict[data.chartType] === 'bar') {
      return this.createBar(data);
    }

    if (this.chartTypeDict[data.chartType] === 'table') {
      return { data };
    }

    if (
      this.chartTypeDict[data.chartType] === 'bar_stacked' ||
      this.chartTypeDict[data.chartType] === 'bar_stacked_plan'
    ) {
      return this.createStackedBar(data);
    }

    if (this.chartTypeDict[data.chartType] === 'pie') {
      return this.createPie(data);
    }

    if (this.chartTypeDict[data.chartType] === 'sankey') {
      return this.createSankey(data);
    }

    if (this.chartTypeDict[data.chartType] === 'bubble') {
      return this.createBubble(data);
    }

    // на самом деле это не sunburst,  а просто данные для отображения плана
    if (this.chartTypeDict[data.chartType] === 'sunburst') {
      return this.createSunburst(data);
    }

    if (this.chartTypeDict[data.chartType] === 'line') {
      return this.createLine(data);
    }
  }

  createLine(data: IChartConfigData) {
    let chartOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        top: 'bottom',
      },
      series: [],
      xAxis: [
        {
          type: 'time',
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
    };

    let lineSeries = [];
    for (let i = 0; i < data.data.data.length; i++) {
      lineSeries.push({
        name: data.data.data[i].key.toString(),
        type: 'line',
        data: data.data.data[i].values.map((elem) => {
          return [elem.x, elem.y];
        }),
      });
    }

    chartOption.series = lineSeries;
    return chartOption;
  }

  // конфиг для столбчатых диаграмм
  createBar(data: IChartConfigData) {
    let chartOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        top: 'bottom',
      },
      series: [],
    };
    const unNullableData = data.data.data ?? data.data.result;
    let sortedData = unNullableData.slice().sort(function (a: any, b: any) {
      a = moment(a[Object.keys(a)[0]]);
      b = moment(b[Object.keys(b)[0]]);
      return a - b;
    });

    let planDataSorted;
    if (Object.keys(data.data.annotation_data ?? {}).length) {
      planDataSorted = data.data.annotation_data[
        Object.keys(data.data.annotation_data)[0]
      ][0].values
        .slice()
        .sort(function (a: any, b: any) {
          a = a.x;
          b = b.x;
          return a - b;
        });
    }

    let seriesData: any = [];
    sortedData.forEach((element: any, index: number) => {
      if (element[Object.keys(element)[0]]) {
        let planColorPalette: Array<string> = ['#8FB3EF', '#6CACEB'];
        if (planDataSorted) {
          if (
            Math.round((element[Object.keys(element)[1]] / planDataSorted[index].y) * 100) > 85 &&
            Math.round((element[Object.keys(element)[1]] / planDataSorted[index].y) * 100) < 100
          ) {
            planColorPalette = ['#8FB3EF', '#6CACEB'];
          } else if (
            Math.round((element[Object.keys(element)[1]] / planDataSorted[index].y) * 100) < 85
          ) {
            planColorPalette = ['#E95046', '#E3170A'];
          } else if (
            Math.round((element[Object.keys(element)[1]] / planDataSorted[index].y) * 100) > 100 ||
            Math.round((element[Object.keys(element)[1]] / planDataSorted[index].y) * 100) === 100
          ) {
            planColorPalette = ['#292584', '#534598'];
          }
        }
        // let planColorPalette = planDataSorted[index].y > element[Object.keys(element)[1]] ? ['#EF8983', '#E3170A'] : ['#9CC6F1', '#3C91E6']

        seriesData.push({
          value: element[Object.keys(element)[1]],
          name: element[Object.keys(element)[0]],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: planColorPalette[0] },
              { offset: 0.5, color: planColorPalette[0] },
              { offset: 1, color: planColorPalette[0] },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: planColorPalette[1] },
                { offset: 0.5, color: planColorPalette[1] },
                { offset: 1, color: planColorPalette[1] },
              ]),
            },
          },
        });
      }
    });

    if (planDataSorted) {
      chartOption.tooltip = {
        confine: true,
        formatter: (obj: any) => {
          let name = new Date(parseInt(obj.name)).toLocaleDateString('ru-RU', {
            month: '2-digit',
            day: '2-digit',
          });
          let value = obj.value;
          let index = obj.dataIndex;
          return (
            '<b>Дата: </b>' +
            name +
            '<br>' +
            '<b>План：</b>' +
            this.shortPipe.transform(planDataSorted[index].y) +
            '<br>' +
            '<b>Факт：</b>' +
            this.shortPipe.transform(value)
          );
        },
      };
    } else {
      chartOption.tooltip = {
        confine: true,
        formatter: (obj: any) => {
          let name = new Date(parseInt(obj.name)).toLocaleDateString('ru-RU', {
            month: '2-digit',
            day: '2-digit',
          });
          let value = obj.value;
          let index = obj.dataIndex;
          return (
            '<b>Дата: </b>' + name + '<br>' + '<b>Значение：</b>' + this.shortPipe.transform(value)
          );
        },
      };
    }

    chartOption.xAxis = {
      type: 'category',
      data: sortedData.map((elem: any) => {
        return new Date(elem[Object.keys(elem)[0]]).toLocaleDateString('ru-RU', {
          month: '2-digit',
          day: '2-digit',
        });
      }),
    };
    chartOption.legend = {};
    //data: barStackedData[Object.keys(barStackedData)[0]].map((elem: any) => { return new Date(elem[Object.keys(elem)[0]]).toLocaleDateString() })
    chartOption.dataZoom = [{ type: 'inside' }];
    chartOption.title = {
      subtext: 'Портфель ежедневно, ₽',
      subtextStyle: {
        fontSize: 14,
      },
    };

    chartOption.yAxis = {
      type: 'value',
      // name: 'Портфель ежедневно, млрд. ₽',
      axisLabel: {
        formatter: (a: any) => {
          a = +a;
          return isFinite(a) ? this.shortPipe.transform(a) : '';
        },
      },
    };

    chartOption.series = [
      {
        type: this.chartTypeDict[data.chartType],
        data: seriesData,
        showBackground: true,
      },
    ];
    return chartOption;
  }

  // конфиг для столбчатых застаканных диаграмм
  createStackedBar(data: IChartConfigData) {
    let chartOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        top: 'bottom',
      },
      series: [],
    };

    let barStackedData = this.groupBy(data.data.data);

    chartOption.xAxis = {
      type: 'category',
      data: barStackedData.__timestamp?.map((elem: any) => {
        return new Date(elem).toLocaleDateString('ru-RU', { month: '2-digit', day: '2-digit' });
      }),
    };

    chartOption.yAxis = {
      type: 'value',
      name: '₽',
      axisLabel: {
        formatter: (a: any) => {
          a = +a;
          return isFinite(a) ? this.shortPipe.transform(a) : '';
        },
      },
    };

    delete barStackedData.__timestamp;

    let stackedSeries: any = [];
    let eleNumber = 0;
    Object.keys(barStackedData).forEach((element) => {
      stackedSeries.push({
        name: element,
        color: this.colorPalette[eleNumber],
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series',
        },
        data: barStackedData[element],
      });
      eleNumber++;
    });

    chartOption.series = stackedSeries;

    // Если у нас кроме самих данных графика передаётся ещё и план. Сейчас он заполняется одним константным числом
    if (this.chartTypeDict[data.chartType] === 'bar_stacked_plan') {
      let planDataSorted = Array(
        data.data.annotation_data[Object.keys(data.data.annotation_data)[0]][0].values.length
      ).fill({ y: 90000000 });
      // Гладкость кривой плана, которая рисуется на графике.
      if (planDataSorted.length) {
        stackedSeries.push({
          name: 'План',
          color: '#017AFF',
          type: 'line',
          smooth: true,
          xAxisIndex: 0,
          data: planDataSorted.map((elem: any) => {
            return elem.y * 4;
          }),
          symbol: 'emptyCircle',
          symbolSize: 10,
        });
      }
    }
    chartOption.dataZoom = [{ type: 'inside' }];
    chartOption.series = stackedSeries;

    return chartOption;
  }

  // конфиг для диаграммы пирожка
  createPie(data: IChartConfigData) {
    let chartOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        top: 'bottom',
      },
      series: [],
    };

    let chartData: any = [];
    data.data?.data.forEach((element: any) => {
      if (element[Object.keys(element)[0]]) {
        chartData.push({
          value: element[Object.keys(element)[1]],
          name: element[Object.keys(element)[0]],
        });
      }
    });

    chartOption.legend = {
      top: 'bottom',
      orient: 'vertical',
      textStyle: {
        fontSize: 14,
      },
    };
    chartOption.series = [
      {
        type: this.chartTypeDict[data.chartType],
        color: this.colorPalette,
        radius: '60%',
        center: ['50%', '40%'],
        data: chartData,
        tooltip: {
          formatter: (params: any) => {
            let colorSpan =
              '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' +
              params.color +
              ';"></span>';
            let val = this.format(params.value);
            return colorSpan + params.name + ': ' + val + ' ₽';
          },
        },
        label: {
          formatter: (params: any) => {
            return this.format(params.percent) + '%';
          },
          fontSize: 24,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ];
    chartOption.data = {
      chartType: 'pie',
    }
    return chartOption;
  }

  // конфиг для диаграммы Санки
  createSankey(data: IChartConfigData) {
    let chartOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        top: 'bottom',
      },
      series: [],
    };

    let sankeyLinks: any = [];
    data.data.data.forEach((element: any) => {
      sankeyLinks.push({
        source: element[Object.keys(element)[0]].toString(),
        target: element[Object.keys(element)[1]].toString(),
        value: element[Object.keys(element)[2]],
      });
    });

    // надо автоматически составлять этот список
    let sankeyData = [
      { name: '1' },
      { name: '2' },
      { name: '3' },
      { name: '4' },
      { name: '5' },
      { name: '6' },
      { name: '7' },
      { name: '8' },
      { name: '9' },
      { name: '10' },
      { name: 'Вклады' },
      { name: 'Дебетовая карта' },
      { name: 'Потребительское кредитование' },
      { name: 'Ипотека' },
      { name: 'Инкассация' },
      { name: 'Кредитная карта' },
      { name: 'Автокредит' },
    ];
    console.log('SANKEY DATA', sankeyData);
    chartOption.series = [
      {
        // name: this.chartDetailComplete.result.slice_name,
        type: this.chartTypeDict[data.chartType],
        color: this.colorPaletteSankey,
        data: sankeyData,
        links: sankeyLinks,
        layoutIterations: 0,
        levels: [
          {
            depth: 1,
            itemStyle: {
              color: '#FF9F1C',
            },
          },
          {
            depth: 0,
            itemStyle: {
              color: '#3C91E6',
            },
          },
        ],
        emphasis: {
          focus: 'adjacency',
        },
        lineStyle: {
          color: 'gradient',
          curveness: 0.5,
        },
      },
    ];

    return chartOption;
  }

  // конфиг в виде объекта с текстом и значениями для отображения числовых значений
  createBigNumber(data: IChartConfigData) {
    let bigNumberObject = data.data.data[0][data.data.colnames[0]];
    let bigNumberData = {
      title: data.chartName,
      data: bigNumberObject,
    };
    return bigNumberData;
  }

  // конфиг для пузырьковой диаграммы
  createBubble(data: IChartConfigData) {
    let chartOption: EChartsOption = {
      tooltip: {
        trigger: 'item',
        confine: true,
      },
      legend: {
        top: 'bottom',
      },
      series: [],
    };

    chartOption = {
      grid: {
        left: '10%',
        top: '20%',
      },
      legend: {
        top: 'auto',
      },
      tooltip: {
        confine: true,
        backgroundColor: 'rgba(255,255,255,0.9)',
        formatter: function (obj: any) {
          var value = obj.value;
          return (
            '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 5px;margin-bottom: 5px">' +
            obj.seriesName +
            '</div>' +
            'Сумма лимитов кредитования' +
            '：' +
            Math.round(value[0] / 100000) / 10 +
            ' млн' +
            '<br>' +
            'Сумма выданных кредитов' +
            '：' +
            Math.round(value[1] / 100000) / 10 +
            ' млн' +
            '<br>' +
            'Число контрактов' +
            '：' +
            value[3] +
            '<br>'
          );
        },
      },
      xAxis: {
        scale: true,
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: 'Лимиты кредитования, млн рублей',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: function (a: any) {
            a = +a;
            return isFinite(a) ? echarts.format.addCommas(+a / 1000000) : '';
          },
        },
      },
      yAxis: {
        splitLine: {
          lineStyle: {
            type: 'dashed',
          },
        },
        name: 'Выданные кредиты, млн рублей',
        nameLocation: 'middle',
        nameGap: 40,
        scale: true,
        axisLabel: {
          formatter: function (a: any) {
            a = +a;
            return isFinite(a) ? echarts.format.addCommas(+a / 1000000) : '';
          },
        },
      },
    };

    let bubbleSeries: any = [];
    data.data.data.forEach((element: any, index: any) => {
      let objValues: any = Object.values(element);
      let bubbleArray = [objValues[2], objValues[3], objValues[0], objValues[1]];
      // bubbleSeries.push(bubbleArray);
      bubbleSeries.push({
        name: objValues[0],
        data: [bubbleArray],
        type: 'scatter',
        symbolSize: bubbleArray[3] / 10,
        emphasis: {
          focus: 'series',
          label: {
            show: true,
            formatter: function (param: any) {
              return param.data[2];
            },
            position: 'top',
          },
        },
        itemStyle: {
          // shadowBlur: 10,
          // shadowColor: 'rgba(120, 36, 50, 0.5)',
          // shadowOffsetY: 5,
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {
              offset: 0,
              color: this.colorPaletteSankey[((index % 10) + 10) % 10],
            },
            //  {
            //     offset: 1,
            //     color: '#616161'
            // }
          ]),
        },
      });
    });
    chartOption.series = bubbleSeries;

    return chartOption;
  }

  // надо что-то подумать о графике, в котором хранятся числа для плана/факта
  createSunburst(data: IChartConfigData) {
    let totalSum = data.data.data[0][data.data.colnames[0]];
    let planSum = data.data.data[0][data.data.colnames[1]];
    let percentValue = Math.round((totalSum / planSum) * 100);
    // let planData = {
    //   title: name,
    //   value: percentValue
    // };

    let chartOption: EChartsOption = {
      tooltip: {
        formatter: '{a} {c}%',
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      xAxis: {
        type: 'value',
        show: false,
        splitLine: { show: false },
        splitArea: { show: false }, // remove the grid area
      },
      yAxis: {
        type: 'category',
        data: ['Исполнение плана'],
        scale: true,
        show: false,
        splitLine: { show: false },
        splitArea: { show: false }, // remove the grid area
      },
      series: [
        {
          name: 'Выполнено',
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            formatter: '{c}%',
            fontWeight: 'bold',
          },
          emphasis: {
            focus: 'series',
          },
          data: [percentValue],
          color: '#292584',
        },
        {
          name: 'Не выполнено',
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            formatter: '{c}%',
            fontWeight: 'bold',
          },
          emphasis: {
            focus: 'series',
          },
          data: [100 - percentValue],
          color: '#8FB3EF',
        },
      ],
    };

    return chartOption;
  }

  // Далее следуют вспомогательные функции для обработки данных

  // превращаем массив даных в объект, сгруппировав данные по определенному ключу
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

  // функция для задания русской локали
  format(data: any) {
    data = parseFloat(data);
    return data.toLocaleString('ru-RU');
  }
}
