import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';
import { LiquidLoadChargeMaterial } from '../../../../shared/models/materials';
import { ChargeMaterial, LiquidChargeMaterial } from '../../../../shared/models/phast/losses/chargeMaterial';
import { Settings } from '../../../../shared/models/settings';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { ChargeMaterialService } from '../charge-material.service';
import { LiquidMaterialFormService, LiquidMaterialWarnings } from './liquid-material-form.service';

@Component({
  selector: 'app-liquid-material-form',
  templateUrl: './liquid-material-form.component.html',
  styleUrls: ['./liquid-material-form.component.css']
})
export class LiquidMaterialFormComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  isBaseline: boolean;
  @Input()
  selected: boolean;
  @Input()
  inModal: boolean;
  @ViewChild('formElement', { static: false }) formElement: ElementRef;
  @ViewChild('flueGasModal', { static: false }) public flueGasModal: ModalDirective;
  @ViewChild('materialModal', { static: false }) public materialModal: ModalDirective;

  resetDataSub: Subscription;
  generateExampleSub: Subscription;

  chargeMaterialForm: FormGroup;
  options: any;
  warnings: LiquidMaterialWarnings;
  selectedMaterialId: any;
  selectedMaterial: any;
  idString: string;
  materialTypes: any;
  showModal: boolean;
  showFlueGasModal: boolean;

  constructor(private suiteDbService: SuiteDbService, 
              private chargeMaterialService: ChargeMaterialService, 
              private convertUnitsService: ConvertUnitsService,
              private liquidMaterialFormService: LiquidMaterialFormService,
              ) {}

  ngOnInit() {
    this.initSubscriptions();
    this.materialTypes = this.suiteDbService.selectLiquidLoadChargeMaterials();
    if (this.chargeMaterialForm) {
      if (this.chargeMaterialForm.controls.materialId.value && this.chargeMaterialForm.controls.materialId.value !== '') {
        if (this.chargeMaterialForm.controls.materialLatentHeat.value === '') {
          this.setProperties();
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected && !changes.selected.firstChange) {
        this.setFormState();
    }
  }

  ngOnDestroy() {
    this.resetDataSub.unsubscribe();
    this.generateExampleSub.unsubscribe();
    this.chargeMaterialService.modalOpen.next(false);
  }

  initSubscriptions() {
    this.resetDataSub = this.chargeMaterialService.resetData.subscribe(value => {
      this.initForm();
      })
    this.generateExampleSub = this.chargeMaterialService.generateExample.subscribe(value => {
      this.initForm();
    })
  }

  initForm() {
    let updatedChargeMaterialData: ChargeMaterial;
    if (this.isBaseline) {
      updatedChargeMaterialData = this.chargeMaterialService.baselineData.getValue();
    } else {
      updatedChargeMaterialData = this.chargeMaterialService.modificationData.getValue();
    }

    if (updatedChargeMaterialData && updatedChargeMaterialData.liquidChargeMaterial) {
      this.chargeMaterialForm = this.liquidMaterialFormService.getLiquidChargeMaterialForm(updatedChargeMaterialData, false);
    } else {
      this.chargeMaterialForm = this.liquidMaterialFormService.initLiquidForm();
    }

    this.checkWarnings();
    this.calculate();
    this.setFormState();
  }

  
  setProperties() {
    let selectedMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (this.settings.unitsOfMeasure === 'Metric') {
      selectedMaterial.vaporizationTemperature = this.convertUnitsService.value(this.roundVal(selectedMaterial.vaporizationTemperature, 4)).from('F').to('C');
      selectedMaterial.latentHeat = this.convertUnitsService.value(selectedMaterial.latentHeat).from('btuLb').to('kJkg');
      selectedMaterial.specificHeatLiquid = this.convertUnitsService.value(selectedMaterial.specificHeatLiquid).from('btulbF').to('kJkgC');
      selectedMaterial.specificHeatVapor = this.convertUnitsService.value(selectedMaterial.specificHeatVapor).from('btulbF').to('kJkgC');
    }
    this.chargeMaterialForm.patchValue({
      materialLatentHeat: this.roundVal(selectedMaterial.latentHeat, 4),
      materialSpecificHeatLiquid: this.roundVal(selectedMaterial.specificHeatLiquid, 4),
      materialSpecificHeatVapor: this.roundVal(selectedMaterial.specificHeatVapor, 4),
      materialVaporizingTemperature: this.roundVal(selectedMaterial.vaporizationTemperature, 4)
    });
    this.calculate();
  }

  setFormState() {
    if (this.selected == false) {
      this.chargeMaterialForm.disable();
    } else {
      this.chargeMaterialForm.enable();
    }
  }

  focusField(str: string) {
    this.chargeMaterialService.currentField.next(str);
  }

  roundVal(val: number, digits: number) {
    let test = Number(val.toFixed(digits));
    return test;
  }

  checkWarnings() {
    let tmpMaterial: LiquidChargeMaterial = this.liquidMaterialFormService.buildLiquidChargeMaterial(this.chargeMaterialForm).liquidChargeMaterial;
    this.warnings = this.liquidMaterialFormService.checkLiquidWarnings(tmpMaterial);
  }

  calculate() {
    this.chargeMaterialForm = this.liquidMaterialFormService.setInitialTempValidator(this.chargeMaterialForm);
    this.checkWarnings();
    let chargeMaterial: ChargeMaterial = this.liquidMaterialFormService.buildLiquidChargeMaterial(this.chargeMaterialForm);
    if (this.isBaseline) {
      this.chargeMaterialService.baselineData.next(chargeMaterial);
    } else { 
      this.chargeMaterialService.modificationData.next(chargeMaterial);
    }
  }

    checkSpecificHeatDiffLiquid() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure === 'Metric') {
        let val = this.convertUnitsService.value(material.specificHeatLiquid).from('btulbF').to('kJkgC');
        material.specificHeatLiquid = this.roundVal(val, 4);
      }
      if (material.specificHeatLiquid !== this.chargeMaterialForm.controls.materialSpecificHeatLiquid.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkVaporizingTempDiff() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure === 'Metric') {
        let val = this.convertUnitsService.value(material.vaporizationTemperature).from('F').to('C');
        material.vaporizationTemperature = this.roundVal(val, 4);
      }
      if (material.vaporizationTemperature !== this.chargeMaterialForm.controls.materialVaporizingTemperature.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkLatentHeatDiff() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure === 'Metric') {
        let val = this.convertUnitsService.value(material.latentHeat).from('btuLb').to('kJkg');
        material.latentHeat = this.roundVal(val, 4);
      }
      if (material.latentHeat !== this.chargeMaterialForm.controls.materialLatentHeat.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkSpecificHeatVaporDiff() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure === 'Metric') {
        let val = this.convertUnitsService.value(material.specificHeatVapor).from('btulbF').to('kJkgC');
        material.specificHeatVapor = this.roundVal(val, 4);
      }
      if (material.specificHeatVapor !== this.chargeMaterialForm.controls.materialSpecificHeatVapor.value) {
        return true;
      } else {
        return false;
      }
    }
  }



  showMaterialModal() {
    this.showModal = true;
    this.chargeMaterialService.modalOpen.next(true);
    this.materialModal.show();
  }

  hideMaterialModal(event?: any) {
    if (event) {
      this.materialTypes = this.suiteDbService.selectLiquidLoadChargeMaterials();
      let newMaterial = this.materialTypes.filter(material => { return material.substance === event.substance; });
      if (newMaterial.length !== 0) {
        this.chargeMaterialForm.patchValue({
          materialId: newMaterial[0].id
        });
        this.setProperties();
      }
    }
    this.showModal = false;
    this.materialModal.hide();
    this.chargeMaterialService.modalOpen.next(false);
  }

  initFlueGasModal() {
    this.showFlueGasModal = true;
    this.chargeMaterialService.modalOpen.next(this.showFlueGasModal);
    this.flueGasModal.show();
  }

  hideFlueGasModal(calculatedAvailableHeat?: any) {
    if (calculatedAvailableHeat) {
      calculatedAvailableHeat = this.roundVal(calculatedAvailableHeat, 1);
      this.chargeMaterialForm.patchValue({
        availableHeat: calculatedAvailableHeat
      });
    }
    this.flueGasModal.hide();
    this.showFlueGasModal = false;
    this.chargeMaterialService.modalOpen.next(this.showFlueGasModal);
  }
}



