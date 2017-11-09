import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PreAssessment } from '../../pre-assessment';

@Component({
  selector: 'app-pre-assessment-metered',
  templateUrl: './pre-assessment-metered.component.html',
  styleUrls: ['./pre-assessment-metered.component.css']
})
export class PreAssessmentMeteredComponent implements OnInit {
  @Input()
  assessment: PreAssessment;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    if (!this.assessment.meteredEnergy) {
      this.assessment.meteredEnergy = {
        meteredEnergyFuel: {
          fuelType: 0,
          heatingValue: 0,
          collectionTime: 0,
          electricityUsed: 0,
          electricityCollectionTime: 0,
          fuelEnergy: 0
        },
        meteredEnergyElectricity: {
          electricityCollectionTime: 0,
          electricityUsed: 0,
          auxElectricityUsed: 0,
          auxElectricityCollectionTime: 0
        },
        meteredEnergySteam: {
          totalHeatSteam: 0,
          flowRate: 0,
          collectionTime: 0,
          electricityUsed: 0,
          electricityCollectionTime: 0
        }
      }
    }
  }

  calculate(){
    console.log(this.assessment.meteredEnergy);
    this.emitCalculate.emit(true);
  }


}
