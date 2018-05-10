import { Component, OnInit, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';
import { SvgToPngService } from '../../../../shared/svg-to-png/svg-to-png.service';
@Component({
  selector: 'app-steam-properties-graph',
  templateUrl: './steam-properties-graph.component.html',
  styleUrls: ['./steam-properties-graph.component.css']
})
export class SteamPropertiesGraphComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  chartContainerWidth: number;
  @Input()
  chartContainerHeight: number;
  @Input()
  printView: boolean;
  @Input()
  exportName: string;

  @ViewChild('ngChart') ngChart: ElementRef;
  @ViewChild('btnDownload') btnDownload: ElementRef;

  tempArray: Array<number>;
  entropyArray: Array<number>;
  pressure0001t: Array<number>;
  pressure0001e: Array<number>;
  pressure001t: Array<number>;
  pressure001e: Array<number>;
  pressure01t: Array<number>;
  pressure01e: Array<number>;
  pressure1t: Array<number>;
  pressure1e: Array<number>;
  pressure2t: Array<number>;
  pressure2e: Array<number>;
  pressure5t: Array<number>;
  pressure5e: Array<number>;
  pressure10t: Array<number>;
  pressure10e: Array<number>;
  pressure20t: Array<number>;
  pressure20e: Array<number>;
  pressure30t: Array<number>;
  pressure30e: Array<number>;
  pressure40t: Array<number>;
  pressure40e: Array<number>;
  pressure50t: Array<number>;
  pressure50e: Array<number>;
  pressure60t: Array<number>;
  pressure60e: Array<number>;
  pressure70t: Array<number>;
  pressure70e: Array<number>;
  pressure80t: Array<number>;
  pressure80e: Array<number>;
  pressure90t: Array<number>;
  pressure90e: Array<number>;
  pressure100t: Array<number>;
  pressure100e: Array<number>;

  yMax: number;
  yMin: number;
  xMax: number;
  xMin: number;
  xAxisLabel: string;
  yAxisLabel: string;
  yAxisTicks: Array<number>;
  xAxisTicks: Array<number>;

  htmlElement: any;
  host: d3.Selection<any>;
  svg: d3.Selection<any>;
  width: number;
  height: number;
  margin: { top: number, right: number, bottom: number, left: number };

  constructor(private svgToPngService: SvgToPngService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    this.initData();
    this.initCanvas();
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartContainerWidth && !changes.chartContainerWidth.firstChange) {
      this.initCanvas();
      this.buildChart();
    }
  }


  initData() {
    //hard coded values will always be the same, these are for metric
    //temperature default is Celcius
    this.tempArray = [0.01, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330, 340, 350, 360, 370, 373.95, 370, 360, 350, 340, 330, 320, 310, 300, 290, 280, 270, 260, 250, 240, 230, 220, 210, 200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0.01];
    //entropy default is kJ/kg*C
    this.entropyArray = [0, 0.0763, 0.1511, 0.2245, 0.2965, 0.3672, 0.4368, 0.5051, 0.5724, 0.6386, 0.7038, 0.768, 0.8313, 0.8937, 0.9551, 1.0158, 1.0756, 1.1346, 1.1929, 1.2504, 1.3072, 1.4188, 1.5279, 1.6346, 1.7392, 1.8418, 1.9426, 2.0417, 2.1392, 2.2355, 2.3305, 2.4245, 2.5177, 2.6101, 2.702, 2.7935, 2.8849, 2.9765, 3.0685, 3.1612, 3.2552, 3.351, 3.4494, 3.5518, 3.6601, 3.7784, 3.9167, 4.1112, 4.407, 4.8012, 5.0536, 5.211, 5.3356, 5.4422, 5.5372, 5.6244, 5.7059, 5.7834, 5.8579, 5.9304, 6.0016, 6.0721, 6.1423, 6.2128, 6.284, 6.3563, 6.4302, 6.5059, 6.584, 6.665, 6.7491, 6.8371, 6.9293, 7.0264, 7.1291, 7.2381, 7.3541, 7.4151, 7.4781, 7.5434, 7.6111, 7.6812, 7.754, 7.8296, 7.9081, 7.9898, 8.0748, 8.1633, 8.2555, 8.3517, 8.452, 8.5566, 8.666, 8.7803, 8.8998, 9.0248, 9.1555];

    this.pressure0001t = [0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 11, 97, 208];
    this.pressure0001e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

    this.pressure001t = [0, 35, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 110, 224, 365, 537];
    this.pressure001e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

    this.pressure01t = [0, 35, 74, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 126, 241, 385, 561, 769, 1010];
    this.pressure01e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

    this.pressure1t = [0, 35, 74, 117, 166, 180, 180, 180, 180, 180, 180, 180, 180, 180, 268, 411, 588, 799, 1043, 1313, 1566];
    this.pressure1e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10];

    this.pressure2t = [0, 35, 74, 118, 166, 212, 212, 212, 212, 212, 212, 212, 212, 241, 362, 524, 721, 953, 1215, 1482];
    this.pressure2e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5];

    this.pressure5t = [0, 35, 74, 118, 166, 219, 264, 264, 264, 264, 264, 264, 267, 362, 507, 694, 918, 1176, 1444];
    this.pressure5e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

    this.pressure10t = [0, 35, 74, 118, 167, 220, 274, 311, 311, 311, 311, 311, 359, 471, 635, 841, 1084, 1352];
    this.pressure10e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5];

    this.pressure20t = [0, 35, 75, 119, 168, 221, 277, 330, 365, 368, 395, 468, 598, 778, 1002, 1260];
    this.pressure20e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 5.5, 6, 6.5, 7, 7.5, 8];

    this.pressure30t = [0, 35, 75, 120, 169, 223, 280, 335, 380, 401, 417, 457, 541, 680, 870, 1103];
    this.pressure30e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5];

    this.pressure40t = [0, 36, 76, 121, 170, 225, 283, 340, 391, 425, 454, 503, 596, 742, 939, 1175];
    this.pressure40e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5];

    this.pressure50t = [0, 36, 76, 121, 172, 227, 285, 345, 400, 443, 483, 541, 641, 792, 993];
    this.pressure50e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7];

    this.pressure60t = [0, 36, 77, 122, 173, 228, 288, 349, 408, 458, 507, 573, 678, 834, 1037];
    this.pressure60e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7];

    this.pressure70t = [0, 37, 77, 123, 174, 230, 290, 353, 415, 471, 527, 600, 711, 870, 1070];
    this.pressure70e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7];

    this.pressure80t = [0, 37, 78, 124, 175, 231, 293, 357, 421, 482, 545, 624, 739, 902];
    this.pressure80e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5];

    this.pressure90t = [0, 37, 78, 124, 176, 233, 295, 360, 427, 492, 560, 645, 765, 930];
    this.pressure90e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5];

    this.pressure100t = [1, 37, 79, 125, 177, 234, 297, 364, 433, 501, 574, 664, 788, 955];
    this.pressure100e = [0.00, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5];

    if (this.settings.unitsOfMeasure == 'Imperial') {
      this.tempArray = this.convertArray(this.tempArray, true);
      this.entropyArray = this.convertArray(this.entropyArray, false);

      this.pressure0001t = this.convertArray(this.pressure0001t, true);
      this.pressure0001e = this.convertArray(this.pressure0001e, false);

      this.pressure001t = this.convertArray(this.pressure001t, true);
      this.pressure001e = this.convertArray(this.pressure001e, false);

      this.pressure01t = this.convertArray(this.pressure01t, true);
      this.pressure01e = this.convertArray(this.pressure01e, false);

      this.pressure1t = this.convertArray(this.pressure1t, true);
      this.pressure1e = this.convertArray(this.pressure1e, false);

      this.pressure2t = this.convertArray(this.pressure2t, true);
      this.pressure2e = this.convertArray(this.pressure2e, false);

      this.pressure5t = this.convertArray(this.pressure5t, true);
      this.pressure5e = this.convertArray(this.pressure5e, false);

      this.pressure10t = this.convertArray(this.pressure10t, true);
      this.pressure10e = this.convertArray(this.pressure10e, false);

      this.pressure20t = this.convertArray(this.pressure20t, true);
      this.pressure20e = this.convertArray(this.pressure20e, false);

      this.pressure30t = this.convertArray(this.pressure30t, true);
      this.pressure30e = this.convertArray(this.pressure30e, false);

      this.pressure40t = this.convertArray(this.pressure40t, true);
      this.pressure40e = this.convertArray(this.pressure40e, false);

      this.pressure50t = this.convertArray(this.pressure50t, true);
      this.pressure50e = this.convertArray(this.pressure50e, false);

      this.pressure60t = this.convertArray(this.pressure60t, true);
      this.pressure60e = this.convertArray(this.pressure60e, false);

      this.pressure70t = this.convertArray(this.pressure70t, true);
      this.pressure70e = this.convertArray(this.pressure70e, false);

      this.pressure80t = this.convertArray(this.pressure80t, true);
      this.pressure80e = this.convertArray(this.pressure80e, false);

      this.pressure90t = this.convertArray(this.pressure90t, true);
      this.pressure90e = this.convertArray(this.pressure90e, false);

      this.pressure100t = this.convertArray(this.pressure100t, true);
      this.pressure100e = this.convertArray(this.pressure100e, false);
    }
  }

  convertArray(oldArray: Array<number>, temperature: boolean): Array<number> {
    let convertedArray = new Array<number>();
    if (temperature) {
      for (let i = 0; i < oldArray.length; i++) {
        convertedArray.push(this.convertVal(oldArray[i], 'C', 'F'));
      }
    }
    else {
      for (let i = 0; i < oldArray.length; i++) {
        convertedArray.push(this.convertVal(oldArray[i], 'kJkgC', 'btulbF'));
      }
    }
    return convertedArray;
  }

  convertVal(val: number, from: string, to: string) {
    if (val != undefined) {
      val = this.convertUnitsService.value(val).from(from).to(to);
    }
    return val;
  }
  roundVal(val: number, digits: number) {
    let test = Number(val.toFixed(digits));
    return test
  }


  initCanvas() {
    this.htmlElement = this.ngChart.nativeElement;
    this.host = d3.select(this.htmlElement);

    if (!this.chartContainerHeight || this.chartContainerHeight === undefined || this.chartContainerHeight <= 0) {
      console.log('chartContainerHeight undefined || false || <= 0');
      this.chartContainerHeight = 800;
    }
    if (!this.chartContainerWidth || this.chartContainerWidth === undefined || this.chartContainerWidth <= 0) {
      console.log('chartContainerWidth undefined || false || <= 0');
      this.chartContainerWidth = 600;
    }

    //these default values are for metric
    this.xMax = 11;
    this.xMin = 0;
    this.yMax = 2000;
    this.yMin = -100;

    if (this.settings.unitsOfMeasure == 'Imperial') {
      this.xMax = this.convertVal(this.xMax, 'kJkgC', 'btulbF');
      this.xMin = this.convertVal(this.xMin, 'kJkgC', 'btulbF');
      this.yMax = this.convertVal(this.yMax, 'C', 'F');
      this.yMin = this.convertVal(this.yMin, 'C', 'F');
    }
  }

  buildChart() {
    this.host.html('');
    this.margin = {
      top: 20,
      right: 20,
      bottom: 50,
      left: 70
    }
    this.width = this.chartContainerWidth - this.margin.left - this.margin.right;
    this.height = this.chartContainerHeight - this.margin.top - this.margin.bottom;
    let svgWidth = this.width;
    let svgHeight = this.height;

    let x = d3.scaleLinear().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);

    //define domain for x and y axis
    x.domain([this.xMin, this.xMax]);
    y.domain([this.yMin, this.yMax]);

    let area = d3.area()
      .x(function (d) {
        return x(d.entropy);
      })
      .y0(svgHeight)
      .y1(function (d) {
        return y(d.temperature);
      });

    let valueLine = d3.line()
      .x(function (d) {
        return x(d.entropy);
      })
      .y(function (d) {
        return y(d.temperature);
      });

    //define svg
    this.svg = this.host.append('svg')
      .attr('width', this.chartContainerWidth)
      .attr('height', this.chartContainerHeight)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    // add the X Axis
    this.svg.append("g")
      .attr("transform", "translate(0," + svgHeight + ")")
      .call(d3.axisBottom(x));

    // add the Y Axis
    this.svg.append("g")
      .call(d3.axisLeft(y));

    //add x grid lines
    this.svg.append("g")
      .attr("class", "grid")
      .style('stroke-width', '.5px')
      .style('stroke', 'lightgrey')
      .attr("transform", "translate(0," + svgHeight + ")")
      .call(this.addXGridLines().tickSize(-svgHeight).tickFormat(""));
    //add y grid lines
    this.svg.append("g")
      .attr("class", "grid")
      .style('stroke-width', '.5px')
      .style('stroke', 'lightgrey')
      .call(this.addYGridLines().tickSize(-svgWidth).tickFormat(""));

    //main dataset with area
    let dataset = this.getDataSet(this.tempArray, this.entropyArray);

    // add the area
    if (this.settings.unitsOfMeasure == 'Imperial') {
      x.domain([this.convertVal(0, 'kJkgC', 'btulbF'), this.convertVal(11, 'kJkgC', 'btulbF')]);
      y.domain([this.convertVal(0, 'C', 'F'), this.convertVal(2000, 'C', 'F')]);
    }
    else {
      x.domain([0, 11]);
      y.domain([0, 2000]);
    }

    this.svg.append("path")
      .data([dataset])
      .attr("class", "area")
      .attr("d", area)
      .style('fill', 'none');


    x.domain([this.xMin, this.xMax]);
    y.domain([this.yMin, this.yMax]);
    // add the valueline path.
    this.svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .attr("d", valueLine)
      .style('fill', 'rgba(70,130,180,0.4)')
      .style('stroke', 'black')
      .style('stroke-width', '3px');

    this.addYAxisLabel();
    this.addXAxisLabel();

    // this.appendLine(dataset);
    this.appendLine(this.getDataSet(this.pressure0001t, this.pressure0001e));
    this.appendLine(this.getDataSet(this.pressure001t, this.pressure001e));
    this.appendLine(this.getDataSet(this.pressure01t, this.pressure01e));
    this.appendLine(this.getDataSet(this.pressure1t, this.pressure1e));
    this.appendLine(this.getDataSet(this.pressure2t, this.pressure2e));
    this.appendLine(this.getDataSet(this.pressure5t, this.pressure5e));
    this.appendLine(this.getDataSet(this.pressure10t, this.pressure10e));
    this.appendLine(this.getDataSet(this.pressure20t, this.pressure20e));
    this.appendLine(this.getDataSet(this.pressure30t, this.pressure30e));
    this.appendLine(this.getDataSet(this.pressure40t, this.pressure40e));
    this.appendLine(this.getDataSet(this.pressure50t, this.pressure50e));
    this.appendLine(this.getDataSet(this.pressure60t, this.pressure60e));
    this.appendLine(this.getDataSet(this.pressure70t, this.pressure70e));
    this.appendLine(this.getDataSet(this.pressure80t, this.pressure80e));
    this.appendLine(this.getDataSet(this.pressure90t, this.pressure90e));
    this.appendLine(this.getDataSet(this.pressure100t, this.pressure100e));
  }

  getDataSet(tempArray: Array<number>, entropyArray: Array<number>) {
    let dataset = d3.range(tempArray.length).map(function (d, i) {
      return {
        'temperature': tempArray[i],
        'entropy': entropyArray[i]
      }
    });
    return dataset;
  }

  //appends a data line onto the svg
  appendLine(dataset: any) {
    let x = d3.scaleLinear().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);

    //define domain for x and y axis
    x.domain([this.xMin, this.xMax]);
    y.domain([this.yMin, this.yMax]);

    let valueLine = d3.line()
      .x(function (d) {
        return x(d.entropy);
      })
      .y(function (d) {
        return y(d.temperature);
      });

    this.svg.append("path")
      .data([dataset])
      .attr("class", "line")
      .attr("d", valueLine)
      .style('fill', 'none')
      .style('stroke', '#D36135')
      .style('stroke-width', '1px');
  }

  addYGridLines() {
    let x = d3.scaleLinear().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);
    x.domain([this.xMin, this.xMax]);
    y.domain([this.yMin, this.yMax]);
    return d3.axisLeft(y).ticks(10);
  }

  addXGridLines() {
    let x = d3.scaleLinear().range([0, this.width]);
    let y = d3.scaleLinear().range([this.height, 0]);
    x.domain([this.xMin, this.xMax]);
    y.domain([this.yMin, this.yMax]);
    return d3.axisBottom(x).ticks(11);
  }

  addYAxisLabel() {
    if (this.settings.unitsOfMeasure == 'Imperial') {
      this.yAxisLabel = "Temperature &#8457;";
    }
    else {
      this.yAxisLabel = "Temperature &#8451;";
    }
    this.svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - this.margin.left)
      .attr("x", 0 - (this.height / 2))
      .attr("dy", "1em")
      .style('font-size', '16px')
      .style("text-anchor", "middle")
      .html(this.yAxisLabel);
  }

  addXAxisLabel() {
    if (this.settings.unitsOfMeasure == 'Imperial') {
      this.xAxisLabel = "Entropy (Btu/lb&#8457;)";
    }
    else {
      this.xAxisLabel = "Entropy (kJ/kg&#8451;)";
    }
    this.svg.append("text")
      .attr("transform", "translate(" + (this.width / 2) + " ," + (this.height + this.margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .style('font-size', '16px')
      .html(this.xAxisLabel);
  }

  downloadChart(): void {
    if (!this.exportName) {
      this.exportName = "steam-properties-calc-chart";
    }
    else {
      this.exportName = this.exportName + '-calc-chart';
    }
    this.exportName = this.exportName.replace(/ /g, '-').toLowerCase();
    this.svgToPngService.exportPNG(this.ngChart, this.exportName);
  }
}
