import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AeratorPerformanceData, WasteWater, WasteWaterData } from '../../shared/models/waste-water';
import { WasteWaterService } from '../waste-water.service';
import { AeratorPerformanceFormService } from './aerator-performance-form.service';

@Component({
  selector: 'app-aerator-performance-form',
  templateUrl: './aerator-performance-form.component.html',
  styleUrls: ['./aerator-performance-form.component.css']
})
export class AeratorPerformanceFormComponent implements OnInit {
  @Input()
  isModification: boolean;
  @Input()
  inSetup: boolean;
  @Input()
  selected: boolean;

  //aerator types
  areatorTypes: Array<{ value: number, display: string }> = [
    {
      value: 1,
      display: 'Mechanical Aerator'
    },
    {
      value: 2,
      display: 'Positive Displacement Blower'
    },
    {
      value: 3,
      display: 'Centrifugal Blowers'
    }
  ]

  form: FormGroup;
  modificationIndex: number;
  selectedModificationIdSub: Subscription;
  constructor(private wasteWaterService: WasteWaterService, private aeratorPerformanceFormService: AeratorPerformanceFormService) { }

  ngOnInit(): void {
    let wasteWater: WasteWater = this.wasteWaterService.wasteWater.getValue();
    if (this.isModification) {
      this.selectedModificationIdSub = this.wasteWaterService.selectedModificationId.subscribe(val => {
        if (val) {
          let wasteWater: WasteWater = this.wasteWaterService.wasteWater.getValue();
          this.modificationIndex = wasteWater.modifications.findIndex(modification => { return modification.id == val });
          let modificationData: WasteWaterData = this.wasteWaterService.getModificationFromId();
          this.form = this.aeratorPerformanceFormService.getFormFromObj(modificationData.aeratorPerformanceData);
          if (this.selected === false) {
            this.disableForm();
          }
        }
      });
    } else {
      this.form = this.aeratorPerformanceFormService.getFormFromObj(wasteWater.baselineData.aeratorPerformanceData);

      if (this.selected === false) {
        this.disableForm();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected && !changes.selected.isFirstChange()) {
      if (this.selected === true) {
        this.enableForm();
      } else if (this.selected === false) {
        this.disableForm();
      }
    }
  }

  ngOnDestroy() {
    if (this.selectedModificationIdSub) this.selectedModificationIdSub.unsubscribe();
  }

  save() {
    let wasteWater: WasteWater = this.wasteWaterService.wasteWater.getValue();
    if (this.isModification) {
      let aeratorPerformanceData: AeratorPerformanceData = this.aeratorPerformanceFormService.getObjFromForm(this.form);
      wasteWater.modifications[this.modificationIndex].aeratorPerformanceData = aeratorPerformanceData;
    } else {
      let aeratorPerformanceData: AeratorPerformanceData = this.aeratorPerformanceFormService.getObjFromForm(this.form);
      wasteWater.baselineData.aeratorPerformanceData = aeratorPerformanceData;
    }
    this.wasteWaterService.wasteWater.next(wasteWater);
  }

  enableForm() {
    this.form.controls.TypeAerators.enable();
  }

  disableForm() {
    this.form.controls.TypeAerators.disable();
  }


  focusField(str: string) {

  }
  isOperatingDODifferent() { }
  isAlphaDifferent() { }
  isBetaDifferent() { }
  isSOTRDifferent() { }
  isAerationDifferent() { }
  isElevationDifferent() { }
  isOperatingTimeDifferent() { }
  isTypeAeratorsDifferent() { }
  isSpeedDifferent() { }
  isEnergyCostUnitDifferent() { }







}
