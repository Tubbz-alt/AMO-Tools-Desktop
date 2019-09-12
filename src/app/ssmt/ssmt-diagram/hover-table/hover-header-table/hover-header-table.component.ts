import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HeaderOutputObj, HeatLossOutput, SSMTOutput } from '../../../../shared/models/steam/steam-outputs';
import { HeaderNotHighestPressure, HeaderWithHighestPressure, SSMTInputs } from '../../../../shared/models/steam/ssmt';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-hover-header-table',
  templateUrl: './hover-header-table.component.html',
  styleUrls: ['./hover-header-table.component.css']
})
export class HoverHeaderTableComponent implements OnInit {
  @Input()
  headerPressure: string;
  @Input()
  settings: Settings;
  @Input()
  outputData: SSMTOutput;
  @Input()
  inputData: SSMTInputs;
  @Input()
  inResultsPanel: boolean;

  @ViewChild('copyTable', { static: false }) copyTable: ElementRef;
  tableString: any;

  header: HeaderOutputObj;
  heatLoss: HeatLossOutput;
  headerInput: HeaderNotHighestPressure | HeaderWithHighestPressure;
  condensingWarning: boolean;
  constructor() { }

  ngOnInit() {
    if (this.headerPressure === 'highPressure') {
      this.header = this.outputData.highPressureHeader;
      this.heatLoss = this.outputData.highPressureSteamHeatLoss;
      this.headerInput = this.inputData.headerInput.highPressure;
    } else if (this.headerPressure === 'mediumPressure') {
      this.header = this.outputData.mediumPressureHeader;
      this.heatLoss = this.outputData.mediumPressureSteamHeatLoss;
      this.headerInput = this.inputData.headerInput.mediumPressure;
    } else if (this.headerPressure === 'lowPressure') {
      this.header = this.outputData.lowPressureHeader;
      this.heatLoss = this.outputData.lowPressureSteamHeatLoss;
      this.headerInput = this.inputData.headerInput.lowPressure;
    }

    if(this.header.quality < 1){
      this.condensingWarning = true;
    }else{
      this.condensingWarning = false;
    }
  }

  updateTableString() {
    this.tableString = this.copyTable.nativeElement.innerText;
  }
}
