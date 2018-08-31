import { Component, OnInit, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { StandaloneService } from "../../standalone.service";
import { AirSystemCapacityInput, AirSystemCapacityOutput } from "../../../shared/models/standalone";
import { Settings } from '../../../shared/models/settings';

@Component({
  selector: 'app-system-capacity',
  templateUrl: './system-capacity.component.html',
  styleUrls: ['./system-capacity.component.css']
})
export class SystemCapacityComponent implements OnInit {
  @Input()
  settings: Settings;

  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }

  headerHeight: number;

  inputs: AirSystemCapacityInput;
  outputs: AirSystemCapacityOutput;

  constructor() { }

  ngOnInit() {
    this.inputs = {
      receiverCapacities: new Array<number>(),
      customPipes: new Array<{ pipeSize: number, pipeLength: number }>(),
      oneHalf: 0,
      threeFourths: 0,
      one: 0,
      oneAndOneFourth: 0,
      oneAndOneHalf: 0,
      two: 0,
      twoAndOneHalf: 0,
      three: 0,
      threeAndOneHalf: 0,
      four: 0,
      five: 0,
      six: 0,
    };

    this.inputs.receiverCapacities.push(0);
    
    this.outputs = {
      receiverCapacities: new Array<number>(),
      customPipes: new Array<{ pipeSize: number, pipeLength: number }>(),
      oneHalf: 0,
      threeFourths: 0,
      one: 0,
      oneAndOneFourth: 0,
      oneAndOneHalf: 0,
      two: 0,
      twoAndOneHalf: 0,
      three: 0,
      threeAndOneHalf: 0,
      four: 0,
      five: 0,
      six: 0,
      totalPipeVolume: 0,
      totalReceiverVolume: 0,
      totalCapacityOfCompressedAirSystem: 0
    };
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  getTotalPipeVolume() {
    this.outputs = StandaloneService.airSystemCapacity(this.inputs);
    let customPipeVolume: number = 0;
    if (this.inputs.customPipes && this.inputs.customPipes.length > 0) {
      customPipeVolume = this.getCustomPipeVolume();
    }
    this.outputs.totalPipeVolume += customPipeVolume;
    this.outputs.totalCapacityOfCompressedAirSystem += customPipeVolume;
    return this.outputs.totalPipeVolume;
  }

  getCustomPipeVolume(): number {
    let volume: number = 0;
    for (let i = 0; i < this.inputs.customPipes.length; i++) {
      volume += this.calculatePipeVolume(this.inputs.customPipes[i].pipeSize, this.inputs.customPipes[i].pipeLength);
    }
    return volume;
  }

  calculatePipeVolume(diameter: number, length: number): number {
    let volume: number = Math.pow((diameter / 24), 2) * Math.PI * length;
    return volume;
  }
}
