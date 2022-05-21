import {Injectable} from '@angular/core';
import {EChartsOption} from 'echarts';
import * as echarts from 'echarts/core';
import langRU from 'echarts/lib/i18n/langRU';

echarts.registerLocale("RU", langRU)

@Injectable({
  providedIn: 'root'
})
export class ManagerDashboardOptionsService {

  public colorPalette: Array<string> = [
    '#E36200',
    '#2648A4',
    '#436AD4',
    '#FF862B',
    '#829CE2',
    '#FFAE72',
    '#B4C4EE',
    '#FAC59A',
  ];


  // список индикаторов, для которых нужно 2 знака после запятой, а не один. Можно дополнять, изменять
  public twoDigitsList = [
    'ROE',
    'ROA',
    'CIR',
    'CoR',
    'NIM',
    'Staff CIR',
    'ЧКД / Опер. Расходы'
  ];

  public wholeInteger = [
    'Активы',
    'Пассивы',
    'RWA',
    'Капитал (МСФО)'
  ];

  public indicatorName: string; // Название показателя, используется для валидации формата отображения чисел.
  constructor() {
  }

  // dashboardType: 0 - Банк
  // dashboardType: 1 - Бизнес-линии
  // просто чтобы выбирать, нужно ли разбивать длинные названия для dynamic графика, или нет
  configDynamicChart(data, XAxisData, dashboardType) {
    this.indicatorName = data.name;
    let planList = [];
    let factList = [];
    let min = [];
    let max = [];
    let yAxisList: Array<number> = [];
    // далее идёт блок вычисления коэффициента, чтобы определить, будут ли наслаиваться метки точек друг на друга
    // или нет. Решение не супер удобное, но средствами echarts невозможно сделать лучше
    // В зависимости от разницы между yMin и yMax вычисляется минимальная разница между точками, при которых они не сливаются.
    // Сначала сформируем массив всех значений оси Y
    if (XAxisData.length > 1) {
      for (let i = 0; i < XAxisData.length; i++) {
        yAxisList.push(data.quarterPlan[i]);
        yAxisList.push(data.quarterFact[i]);
        yAxisList.push(data.min[i] ?? data.quarterFact[i]);
        yAxisList.push(data.max[i] ?? data.quarterFact[i]);
      }
    } else {
      let filterIndex = XAxisData[0] - 1;
      yAxisList.push(data.quarterPlan[filterIndex]);
      yAxisList.push(data.quarterFact[filterIndex]);
      yAxisList.push(data.min[filterIndex] ?? data.quarterFact[filterIndex]);
      yAxisList.push(data.max[filterIndex] ?? data.quarterFact[filterIndex]);
    }
    // Здесь высчитываются значения, которые понадобятся не только для определения, нужна метка или нет, но и дальше для задания границ оси Y
    yAxisList = yAxisList.filter(item => item !== null);
    let yMax = Math.max(...yAxisList);
    let yMin = Math.min(...yAxisList);
    let yDifference = yMax - yMin;
    // Значение коэффициента можно менять, но оно примерно означает, что если разница между метками 5% оси Y и больше
    // То рисуются обе метки
    let markerDistance = 0.05 * yDifference;

    if (XAxisData.length > 1 && data) {
      for (let i = 0; i < XAxisData.length; i++) {
        let sumPlan = data.quarterPlan[i];
        let sumFact = data.quarterFact[i];
        let minValue = data.min[i];
        let maxValue = data.max[i];
        // yAxisList.push(sumPlan);
        // yAxisList.push(sumFact);
        if (minValue) {
          min.push({
            name: '',
            coord: [i, minValue],
            value: minValue,
            label: {
              color: '#ed1b24',
              formatter: (data) => {
                return this.format(data.value)
              }
            }
          });
        }
        if (maxValue) {

          max.push({
            name: '',
            coord: [i, maxValue],
            value: maxValue,
            label: {
              color: '#ffc73f',
              formatter: (data) => {
                return this.format(data.value)
              }
            }
          });
        }
        if (Math.abs(sumPlan - sumFact) > markerDistance) {
          planList.push({
            name: '',
            coord: [i, sumPlan],
            value: sumPlan,
            label: {
              color: '#fff',
              formatter: (data) => {
                return this.format(data.value)
              }
            },
          });
          factList.push({
            name: '',
            coord: [i, sumFact],
            value: sumFact,
            label: {
              color: '#fff',
              formatter: (data) => {
                return this.format(data.value)
              }
            },
          });
        } else {
          planList.push({
            name: '',
            value: sumPlan,
          });
          factList.push({
            name: '',
            coord: [i, sumFact],
            value: sumFact,
            label: {
              color: '#fff',
              formatter: (data) => {
                return this.format(data.value)
              }
            },
          });
        }
      }
    } else if (data) {

      let filterIndex = XAxisData[0] - 1;
      let sumPlan = data.quarterPlan[filterIndex];
      let sumFact = data.quarterFact[filterIndex];

      planList.push({
        name: '',
        coord: [0, sumPlan],
        value: sumPlan,
        label: {
          color: '#fff',
          formatter: (data) => {
            return this.format(data.value)
          }
        },
      });
      factList.push({
        name: '',
        coord: [0, sumFact],
        value: sumFact,
        label: {
          color: '#fff',
          formatter: (data) => {
            return this.format(data.value)
          }
        },
      });
    }

    let titleText = `Динамика ${data.name}, ${data.unit ?? ''}`;
    let length = titleText.length;
    if (length > 30 && dashboardType) {
      let middle = Math.round(length / 2);
      let spaceNearMiddle = titleText.indexOf(' ', middle);
      let string1 = titleText.substring(0, spaceNearMiddle);
      let string2 = titleText.substring(spaceNearMiddle + 1, length);
      titleText = string1 + '\n' + string2;
    }
    let chartOption: EChartsOption = {
      textStyle: {
        fontFamily: 'Gilroy'
      },
      title: {
        text: titleText,
        textStyle: {
          fontSize: '16px',
          fontWeight: 700
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (data) => {
          let res = []
          res.push(`${data[0].axisValueLabel}`)
          data.forEach(element => {
            if (element.value) {
              res.push(`<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${element.color};\"></span>
              ${element.seriesName}   ${this.format(element.value, true)}`)
            }
          });
          return res.join('</br>');
        }
      },
      legend: {
        right: 70
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: XAxisData.map(element => `${element} кв 2021`),
      },
    };

    let chartSeries = []
    if (!planList.map(element => element.value).every(element => element === null)) {
      chartSeries.push({
        name: 'План',
        type: 'line',
        data: planList.map(element => element.value),
        markPoint: {
          symbol: 'roundRect',
          symbolSize: [40, 20],
          data: planList
        },
        color: '#2C5DE5',
      });
    }

    if (!factList.map(element => element.value).every(element => element === null)) {
      chartSeries.push({
        name: 'Факт',
        type: 'line',
        data: factList.map(element => element.value),
        markPoint: {
          symbol: 'roundRect',
          symbolSize: [40, 20],
          data: factList
        },
        color: '#FB6B1A'
      })
    }

    if (!min.map(element => element.value).every(element => element === null)) {
      chartSeries.push({
        name: 'Жёлтая зона',
        type: 'line',
        data: min.map(element => element.value),
        color: '#ffc73f'
      })
    }

    if (!max.map(element => element.value).every(element => element === null)) {
      chartSeries.push({
        name: 'Красная зона',
        type: 'line',
        data: max.map(element => element.value),
        color: '#ed1b24'
      })
    }

    // если у нас только один график в итоге, то границы оси Y задаем по нему. Если 2 - то как max и min из всех значений
    if (chartSeries.length > 1) {

      // некоторые математические вычисления. В общем, будем делать отступ от края (то есть фактически yMin-yDifference*N), где
      // N - регулируемый коэффициент (допустим, десятая часть высоты оси Y)
      // Таким же образом можно задавать отступ сверху, например
      let N = 0.1; // при желании можно поменять значение
      chartOption.yAxis = {
        type: 'value',
        axisLabel: {
          formatter: (params) => {
            let val = this.format(params);
            return val;
          },
          margin: 30
        },
        min: yMin - yDifference * N,
        max: yMax
      }
    } else if (chartSeries.length > 0) {
      let yMax = Math.max(...chartSeries[0]?.data);
      let yMin = Math.min(...chartSeries[0]?.data);
      let yDifference = yMax - yMin;
      let N = 0.1; // при желании можно поменять значение
      chartOption.yAxis = {
        type: 'value',
        axisLabel: {
          formatter: (params) => {
            let val = this.format(params);
            return val;
          },
          margin: 30
        },
        min: yMin - yDifference * N,
        max: yMax
      }
    } else {
      chartOption.yAxis = {
        type: 'value',
        axisLabel: {
          formatter: (params) => {
            let val = this.format(params);
            return val;
          },
        },
      }
    }

    chartOption.series = chartSeries;
    return chartOption;
  }

  configDecompositionChart(data, XAxisData, parentUnit) {
    this.indicatorName = data?.indicator;
    let chartSeries = [];
    // по тз не все графики должны быть в ввиде stacked_bar, значение stackValue как раз вычисляет такие
    let stackValue = data?.indicator === 'CSI' || data?.indicator === 'NPS' || parentUnit === '%' ? null : 'Ad';
    if (XAxisData.length > 1 && data) {
      for (const [index, element] of data.data.entries()) {
        if (element.quarterFact.every(element => element > 0)) {
          chartSeries.push({
            name: element.name,
            type: 'bar',
            stack: stackValue,
            emphasis: {
              focus: 'series'
            },
            color: this.colorPalette[index],
            data: element.quarterFact
          })
        } else {
          chartSeries.unshift({
            name: element.name,
            type: 'bar',
            stack: stackValue,
            emphasis: {
              focus: 'series'
            },
            color: this.colorPalette[index],
            data: element.quarterFact
          })
        }
      }
      if (stackValue) {
        // Своеобразная проверка, если у нас все значения нулевые, то мы просто не добавляем series для суммы значений
        let allNull = false;
        let allNullArray = [];
        chartSeries.forEach(element => {
          if (!element.data.every(element => element === null)) {
            allNullArray.push(1);
          }
        })
        allNull = allNullArray.length > 0 ? false : true;
        if (!allNull) {
          chartSeries.push({
            name: '',
            type: 'bar',
            stack: stackValue,
            emphasis: {
              focus: 'series'
            },
            // вынужденная мера, чтобы число суммы было выше 0 всегда
            data: [0.00000001, 0.00000001, 0.00000001, 0.00000001]
          })
        }
      }
    } else if (data) {
      let filterIndex = XAxisData[0] - 1;
      for (const [index, element] of data.data.entries()) {
        if (element.quarterFact.every(element => element > 0)) {
          chartSeries.push({
            name: element.name,
            type: 'bar',
            stack: stackValue,
            emphasis: {
              focus: 'series'
            },
            color: this.colorPalette[index],
            data: [element.quarterFact[filterIndex]]
          })
        } else {
          chartSeries.unshift({
            name: element.name,
            type: 'bar',
            stack: stackValue,
            emphasis: {
              focus: 'series'
            },
            color: this.colorPalette[index],
            data: [element.quarterFact[filterIndex]]
          })
        }
      }
      if (stackValue) {
        let allNull = false;
        let allNullArray = [];
        chartSeries.forEach(element => {
          if (!element.data.every(element => element === null)) {
            allNullArray.push(1);
          }
        })
        allNull = allNullArray.length > 0 ? false : true;
        if (!allNull) {
          chartSeries.push({
            name: '',
            type: 'bar',
            stack: stackValue,
            emphasis: {
              focus: 'series'
            },
            data: [0.00000001]
          })
        }
      }
    }

    if (stackValue && chartSeries[chartSeries.length - 1]) {
      chartSeries[chartSeries.length - 1].label = {
        show: true,
        position: 'top',
        formatter: (params) => {
          let total = 0;
          chartSeries.forEach(series => {
            total += series.data[params.dataIndex];
          })
          return this.format(total);
        },
        fontSize: '16px',
        fontWeight: 700,
      }
    }

    let gridPercent = '0';
    if (chartSeries.length > 5) {
      gridPercent = '30%';
    } else {
      gridPercent = '20%';
    }

    let titleText = `Декомпозиция ${data?.indicator ?? ''}, ${data?.unit ?? ''}`;
    let length = titleText.length;
    if (length > 60) {
      let middle = Math.round(length / 2);
      let spaceNearMiddle = titleText.indexOf(' ', middle);
      let string1 = titleText.substring(0, spaceNearMiddle);
      let string2 = titleText.substring(spaceNearMiddle + 1, length);
      titleText = string1 + '\n' + string2;
    }
    let chartOption: EChartsOption = {
      textStyle: {
        fontFamily: 'Gilroy'
      },
      title: {
        text: titleText,
        textStyle: {
          fontSize: '16px',
          fontWeight: 700
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (data) => {
          let res = []
          data.forEach(element => {
            if (Math.abs(element.value) !== 0.00000001) {
              res.push(`<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${element.color};\"></span>
              ${element.seriesName} : ${this.format(element.value, true)}`)
            }
          });
          return res.join('</br>');
        }
      },
      grid: {
        bottom: gridPercent
      },
      legend: {
        top: 'bottom',
        textStyle: {
          fontSize: '12px'
        },
        itemHeight: 12,
        itemWidth: 18,
        height: '150px'
        // type: 'scroll'
      },
      label: {
        show: true,
        formatter: (d) => {
          if (d.data) {
            return this.format(d.data)
          }
        }
      },
      // grid: {
      //   left: '3%',
      //   right: '4%',
      //   bottom: '3%',
      //   containLabel: true
      // },
      xAxis: [
        {
          type: 'category',
          data: XAxisData.map(element => `${element} кв 2021`)
        }
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false
          },
          axisLabel: {
            formatter: (value) => {
              return this.format(value)
            }
          }
        },
      ],
      series: chartSeries,
    };
    return chartOption;
  }

  configRatingChart(data, indicatorName, unitName) {
    this.indicatorName = indicatorName;
    let yAxisData = [];
    let seriesData = [];
    if (data) {
      for (let elem of data) {
        if (elem.value) {
          yAxisData.push(elem.bank_name);
          if (elem.bank_name !== 'ПСБ') {
            seriesData.push({
              value: elem.value,
              itemStyle: {color: '#E4E4E4'},
            });
          } else {
            seriesData.push({
              value: elem.value,
              itemStyle: {color: '#FB6B1A', fontWeight: 700},
            });
          }
        }
      }
    } else {
      // старая заглушка
      // yAxisData = ['Открытие', 'Уралсиб', 'Райффайзен банк', 'Альфа', 'Росбанк', 'ВТБ', 'Юникредит', 'МКБ', 'ПСБ'];
      // seriesData = [
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {color: '#E4E4E4'},
      //   },
      //   {
      //     value: 0,
      //     itemStyle: {
      //       color: '#2C5DE5',
      //       fontWeight: 700
      //     },
      //   }
      // ]

      let chartOption: EChartsOption = {};
      return chartOption;
    }

    let titleText = '';
    if (data) {
      titleText = `Рейтинг банков: ${indicatorName} (2021 г.), ${unitName ?? 'млрд. руб'}`
    } else {
      titleText = `Рейтинг банков: ${indicatorName} (2021 г.), млрд. руб`
    }
    let length = titleText.length;
    if (length > 60) {
      let middle = Math.round(length / 2);
      let spaceNearMiddle = titleText.indexOf(' ', middle);
      let string1 = titleText.substring(0, spaceNearMiddle);
      let string2 = titleText.substring(spaceNearMiddle + 1, length);
      titleText = string1 + '\n' + string2;
    }
    let chartOption: EChartsOption = {
      textStyle: {
        fontFamily: 'Gilroy'
      },
      title: {
        text: titleText,
        textStyle: {
          fontSize: '16px',
          fontWeight: 700,
        }
      },
      label: {
        show: true,
        formatter: (d) => {
          if (d.data) {
            if (d.name === 'ПСБ') {
              return `{psb|${this.format(d.data.value, false, true)}${unitName === '%' ? unitName : ''}}`
            } else {
              return `{normal|${this.format(d.data.value, false, true)}${unitName === '%' ? unitName : ''}}`
            }
          }
        },
        rich: {
          psb: {
            fontWeight: 700,
            color: 'black'
          },
          normal: {
            fontWeight: 400
          }
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          // Use axis to trigger tooltip
          type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        },
        formatter: (data) => {
          let res = []
          data.forEach(element => {
            if (element.value) {
              res.push(`<span style=\"display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${element.color};\"></span>
              ${element.seriesName}    ${this.format(element.value, true, true)}`)
            }
          });
          return res.join('</br>');
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        show: false,
        // type: 'category',
        splitLine: {
          show: false
        },
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        inverse: true,
        axisLabel: {
          formatter: function (value) {
            if (value === 'ПСБ') {
              return `{psb|${value}}`;
            } else {
              return `{normal|${value}}`;
            }
          },
          rich: {
            psb: {
              fontWeight: 700,
              color: 'black'
            },
            normal: {
              fontWeight: 'lighter'
            }
          },
          margin: 10
        }
      },
      series: [
        {
          name: `${indicatorName}`,
          type: 'bar',
          stack: 'total',
          label: {
            show: true
          },
          emphasis: {
            focus: 'series'
          },
          data: seriesData
        },
      ]
    };

    return chartOption;
  }

  // функция для задания русской локали
  // istooltip - потому что если формат вызывается из тултипа, то немного другой порядок форматирования
  // calledFromRating - потому что в графике рейтинга банков обязательно должен быть 1 знак после запятой
  format(data: any, isTooltip: boolean = false, calledFromRating: boolean = false) {
    data = parseFloat(data);
    if (this.twoDigitsList.includes(this.indicatorName) && isTooltip) {
      return data.toLocaleString('ru-RU', {maximumFractionDigits: 2, minimumFractionDigits: 2});
    } else if (this.wholeInteger.includes(this.indicatorName)) {
      return data.toLocaleString('ru-RU', {maximumFractionDigits: 0, minimumFractionDigits: 0});
    } else if (this.twoDigitsList.includes(this.indicatorName) && calledFromRating) {
      return data.toLocaleString('ru-RU', {maximumFractionDigits: 1, minimumFractionDigits: 1});
    } else {
      return data.toLocaleString('ru-RU', {maximumFractionDigits: 1});
    }
  }
}
