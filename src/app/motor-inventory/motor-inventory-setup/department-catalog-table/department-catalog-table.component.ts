import { Component, OnInit } from '@angular/core';
import { MotorInventoryService } from '../../motor-inventory.service';
import { MotorCatalogService } from '../motor-catalog/motor-catalog.service';
import { Subscription } from 'rxjs';
import { MotorInventoryDepartment, MotorInventoryData, MotorItem } from '../../motor-inventory';
import { Settings } from '../../../shared/models/settings';
import { BatchAnalysisService } from '../../batch-analysis/batch-analysis.service';

@Component({
  selector: 'app-department-catalog-table',
  templateUrl: './department-catalog-table.component.html',
  styleUrls: ['./department-catalog-table.component.css']
})
export class DepartmentCatalogTableComponent implements OnInit {

  selectedMotorDepartment: MotorInventoryDepartment;

  motorInventoryDataSub: Subscription;
  motorInventoryData: MotorInventoryData;

  selectedDepartmentId: string;
  selectedDepartmentIdSub: Subscription;
  settings: Settings;
  settingsSub: Subscription;
  tableDataItems: Array<DepartmentCatalogTableDataItem>;

  selectedMotorItem: MotorItem;
  selectedMotorItemSub: Subscription;
  constructor(private motorInventoryService: MotorInventoryService, private motorCatalogService: MotorCatalogService, private batchAnalysisService: BatchAnalysisService) { }

  ngOnInit(): void {
    this.settingsSub = this.motorInventoryService.settings.subscribe(val => {
      this.settings = val;
    })
    this.motorInventoryDataSub = this.motorInventoryService.motorInventoryData.subscribe(val => {
      this.motorInventoryData = val;
      this.setSelectedMotorDepartment();
    });

    this.selectedDepartmentIdSub = this.motorCatalogService.selectedDepartmentId.subscribe(val => {
      this.selectedDepartmentId = val;
      this.setSelectedMotorDepartment();
    });

    this.selectedMotorItemSub = this.motorCatalogService.selectedMotorItem.subscribe(val => {
      this.selectedMotorItem = val;
    });
  }

  ngOnDestroy() {
    this.motorInventoryDataSub.unsubscribe();
    this.selectedDepartmentIdSub.unsubscribe();
    this.settingsSub.unsubscribe();
    this.selectedMotorItemSub.unsubscribe();
  }

  setSelectedMotorDepartment() {
    if (this.motorInventoryData && this.selectedDepartmentId) {
      this.selectedMotorDepartment = this.motorInventoryData.departments.find(department => { return department.id == this.selectedDepartmentId });
      this.setTableData();
    }
  }

  addNewMotor() {
    let newMotor: MotorItem = this.motorInventoryService.getNewMotor(this.selectedDepartmentId);
    this.motorInventoryData.departments.forEach(department => {
      if (department.id == this.selectedDepartmentId) {
        department.catalog.push(newMotor);
      }
    });
    this.motorInventoryService.motorInventoryData.next(this.motorInventoryData);
    this.motorCatalogService.selectedMotorItem.next(newMotor);
  }

  selectMotor(motor: MotorItem) {
    this.motorCatalogService.selectedMotorItem.next(motor);
  }


  setTableData() {
    let tableDataItems: Array<DepartmentCatalogTableDataItem> = new Array();
    this.selectedMotorDepartment.catalog.forEach(motorItem => {
      let motorItemData: DepartmentCatalogTableDataItem = this.getMotorItemData(motorItem);
      tableDataItems.push(motorItemData);
    });
    this.tableDataItems = tableDataItems;
  }

  getMotorItemData(motorItem: MotorItem): DepartmentCatalogTableDataItem {
    let batchAnalysisDataAndResults = this.batchAnalysisService.getDataAndResultsFromMotorItem(motorItem, this.settings);
    let tableDataItem: DepartmentCatalogTableDataItem = {
      name: motorItem.name,
      operatingHours: motorItem.operationData.annualOperatingHours,
      efficiencyClass: motorItem.nameplateData.efficiencyClass,
      estimatedEfficiency: motorItem.nameplateData.nominalEfficiency,
      ratedPower: motorItem.nameplateData.ratedMotorPower,
      energyUsage: batchAnalysisDataAndResults.results.existingEnergyUse,
      energyCost: batchAnalysisDataAndResults.results.existingEnergyCost,
      motorItem: motorItem
    }
    return tableDataItem;
  }

}

export interface DepartmentCatalogTableDataItem {
  name: string,
  operatingHours: number,
  efficiencyClass: number,
  estimatedEfficiency: number,
  ratedPower: number,
  energyUsage: number,
  energyCost: number,
  motorItem: MotorItem
}