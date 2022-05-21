import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EChartsOption } from 'echarts';
import * as echarts from 'echarts'
import { HttpClient } from '@angular/common/http';

import * as d3 from 'd3';
import * as d3Scale from 'd3';
import * as d3Shape from 'd3';
import * as d3Array from 'd3';
import * as d3Axis from 'd3';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('chart')
  chart!: ElementRef;

  mapLoaded = false;
  options = {};
  down = false;

  public testColor: string = '';
  public ctprvnList: any = [];
  public sigList: any = [];
  showBorough = false;

  ctprvn = '0';
  sig:any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // this.loadGeoJSON('0');
    // this.d3Map();
  }

  // mouseUp(params:any): void {
  //   console.log(params);
  //   console.log('mouseup');

  //   if (!this.down) {
  //     return;
  //   }
  //   this.down = false;

  //   // let mapChart = echarts.getInstanceByDom(this.chart.nativeElement);
  //   // let geoCoord = mapChart.convertFromPixel({seriesName: 'SeoulMap'}, [params.event.offsetX, params.event.offsetY]);

  //   // console.log(mapChart.getOption().series[0].zoom);

  //   // mapChart.setOption({
  //   //   series: [{
  //   //     center: mapChart.getOption().series[0]['zoom'] > 1 ? this.mapCenter : geoCoord,
  //   //     zoom: mapChart.getOption().series[0]['zoom'] > 1 ? 1 : 4,
  //   //     animationDurationUpdate: 1000,
  //   //     animationEasingUpdate: 'cubicInOut'
  //   //   }]
  //   // });

  //   // mapChart.showLoading();
  //   if (params.data.code.length == 2) {
  //     this.ctprvn = params.data.code;
  //     this.loadGeoJSON(params.data.code);
  //   } else {
  //     this.sig = params.data.code;
  //   }
  // }

  // mouseDown(params:any): void {
  //   console.log('mousedown');
  //   this.down = true;
  // }

  // mouseMove(params:any): void {
  //   console.log('mousemove');
  //   this.down = false;
  // }

  // onChangeCtprvn(): void {
  //   this.loadGeoJSON(this.ctprvn);
  // }

  // onChangeSig(): void {
  //   // 영역 강조
  // }

//   private loadGeoJSON(code = '0'): void {
//     this.mapLoaded = false;
//     this.http.get('../../../../assets/russia_geojson_wgs84.geojson')
//       .subscribe((geoJson: any) => {

//         // hide loading:
//         this.mapLoaded = true;
//         // register map:
//         echarts.registerMap('Russia', geoJson);

//         this.options = {
         
//           series: [
//             {
//               name: 'Russiamap',
//               type: 'map',
//               map: 'Russia', // map type should be registered
//               roam: true,
//               selectedMode: 'false',
              
//             }
//           ]
//         };

//       });
//   }

//   private d3Map() {
//     var width = 960,
//     height = 500;

// // var path = d3.geo.path();

// var svg = d3.select("#d3-chart").append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var url = "../../../../assets/ru.topo.json"
// d3.json(url, (error, topology: any) => {
//   if (error) throw error;
//   var projection = d3.geo.albers()
//   .rotate([-105, 0, 0])
//   .center([-10, 65])
//   .parallels([52, 64])
//   .scale(700)
//   .translate([width / 2, height / 2]);

//   var path = d3.geo.path().projection(projection);

//   console.log("topojson", topology)
//   let geojson: any = topojson.feature(topology, topology.objects.russia_geojson_wgs84);
//   console.log("geojson", geojson)

//   echarts.registerMap('Russia', geojson);

//   this.options = {
   
//     series: [
//       {
//         name: 'Russiamap',
//         type: 'map',
//         map: 'Russia', // map type should be registered
//         roam: true,
//         selectedMode: 'false',
        
//       }
//     ]
//   };

//   svg.selectAll("path")
//       .data(geojson.features)
//     .enter().append("path")
//       .attr("d", path)  
//       .style("fill", this.testColor || '#ccc')
//       .style("stroke", "#fff")
//       .style("opacity", 0.8)
//       .on("mouseover", (d) => {
//         console.log(d3.event, d)
//         this.testColorChange('orange');
//         // d3.select(d3.event.target).attr({fill: 'orange'});
//       })
//       .on("mouseout", (d) => {
//         this.testColorChange('black');
//         // d3.select(this).attr({fill: 'orange'});
//       })

//       console.log(this.testColor)
// });


//   }

//   testColorChange(color: string) {
//     this.testColor = color;
//     console.log(this.testColor) 
//   }
  

}
