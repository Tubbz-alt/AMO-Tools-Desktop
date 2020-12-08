import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Settings } from '../../../shared/models/settings';
import { WasteWater, WasteWaterData, WasteWaterResults, WasteWaterValid } from '../../../shared/models/waste-water';
import { WasteWaterService } from '../../waste-water.service';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css']
})
export class ResultsTableComponent implements OnInit {

  wastWaterSub: Subscription;
  modificationValid: WasteWaterValid;
  baselineResults: WasteWaterResults;
  modificationResults: WasteWaterResults;
  showModification: boolean;
  modificationName: string;
  settings: Settings;
  constructor(private wasteWaterService: WasteWaterService) { }

  ngOnInit(): void {
    this.settings = this.wasteWaterService.settings.getValue();
    this.wastWaterSub = this.wasteWaterService.wasteWater.subscribe(val => {
      this.baselineResults = this.wasteWaterService.calculateResults(val.baselineData.activatedSludgeData, val.baselineData.aeratorPerformanceData, val.systemBasics, this.settings);
      let modificationData: WasteWaterData = this.wasteWaterService.getModificationFromId();
      if (modificationData) {
        this.modificationValid = modificationData.valid;
        this.modificationName = modificationData.name;
        this.modificationResults = this.wasteWaterService.calculateResults(modificationData.activatedSludgeData, modificationData.aeratorPerformanceData, val.systemBasics, this.settings, this.baselineResults);
        this.showModification = true;
      } else {
        this.modificationName = undefined;
        this.showModification = false;
        this.modificationValid = undefined;
      }
    });
  }

  ngOnDestroy() {
    this.wastWaterSub.unsubscribe();
  }

}