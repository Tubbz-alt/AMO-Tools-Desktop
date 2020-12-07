import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { WallLossesSurface } from '../../../../shared/models/materials';
import { WallLoss } from '../../../../shared/models/phast/losses/wallLoss';
import { Settings } from '../../../../shared/models/settings';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { WallFormService } from '../wall-form.service';
import { WallService } from '../wall.service';

@Component({
  selector: 'app-wall-form',
  templateUrl: './wall-form.component.html',
  styleUrls: ['./wall-form.component.css']
})
export class WallFormComponent implements OnInit {
  
  @Input()
  settings: Settings;
  @Input()
  isBaseline: boolean;
  @Input()
  inModal: boolean;
  @Input()
  selected: boolean;
  @ViewChild('surfaceModal', { static: false }) public surfaceModal: ModalDirective;
  @ViewChild('flueGasModal', { static: false }) public flueGasModal: ModalDirective;
  @ViewChild('formElement', { static: false }) formElement: ElementRef;

  
  surfaceOptions: Array<WallLossesSurface>;
  showSurfaceModal: boolean = false;

  wallLossesForm: FormGroup;
  resetDataSub: Subscription;
  generateExampleSub: Subscription;
  showFlueGasModal: boolean;

  constructor(private wallFormService: WallFormService,
              private suiteDbService: SuiteDbService,
              private wallService: WallService,
              private cd: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.initSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selected && !changes.selected.firstChange) {
      this.setFormState();
    }
  }

  initSubscriptions() {
    this.resetDataSub = this.wallService.resetData.subscribe(value => {
      this.initForm();
      })
    this.generateExampleSub = this.wallService.generateExample.subscribe(value => {
      this.initForm();
    })
  }

  setFormState() {
    if (this.selected == false) {
      this.wallLossesForm.disable();
    } else {
      this.wallLossesForm.enable();
    }
  }

  initForm() {
    let updatedWallLossData: WallLoss;
    if (this.isBaseline) {
      updatedWallLossData = this.wallService.baselineData.getValue();
    } else {
      updatedWallLossData = this.wallService.modificationData.getValue();
    }
    if (updatedWallLossData) {
      this.wallLossesForm = this.wallFormService.getWallLossForm(updatedWallLossData);
    } else {
      this.wallLossesForm = this.wallFormService.initForm();
    }

    this.surfaceOptions = this.suiteDbService.selectWallLossesSurface();
    this.calculate();
    this.setFormState();
  }

  disableForm() {
    this.wallLossesForm.controls.surfaceShape.disable();
  }
  enableForm() {
    this.wallLossesForm.controls.surfaceShape.enable();
  }

  focusField(str: string) {
    this.wallService.currentField.next(str);
  }

  calculate() {
    this.wallLossesForm = this.wallFormService.setValidators(this.wallLossesForm);
    if (this.wallLossesForm.valid) {
      let currentWallLoss: WallLoss = this.wallFormService.getWallLossFromForm(this.wallLossesForm);
      if (this.isBaseline) {
        this.wallService.baselineData.next(currentWallLoss);
      } else {
        this.wallService.modificationData.next(currentWallLoss);
      }
    }
  }

  setProperties() {
    let tmpFactor = this.suiteDbService.selectWallLossesSurfaceById(this.wallLossesForm.controls.surfaceShape.value);
    this.wallLossesForm.patchValue({
      conditionFactor: this.roundVal(tmpFactor.conditionFactor, 4)
    });
    this.calculate();
  }

  roundVal(val: number, digits: number) {
    let rounded = Number(val.toFixed(digits));
    return rounded;
  }

  showSurfaceShapeModal() {
    this.showSurfaceModal = true;
    this.wallService.modalOpen.next(this.showSurfaceModal);
    this.surfaceModal.show();
  }

  hideSurfaceShapeModal(event?: any) {
    if (event) {
      this.surfaceOptions = this.suiteDbService.selectWallLossesSurface();
      let newMaterial = this.surfaceOptions.filter(material => { return material.surface === event.surface; });
      if (newMaterial.length !== 0) {
        this.wallLossesForm.patchValue({
          surfaceShape: newMaterial[0].id
        });
        this.setProperties();
      }
    }
    this.surfaceModal.hide();
    this.showSurfaceModal = false;
    this.wallService.modalOpen.next(this.showSurfaceModal);
  }

  initFlueGasModal() {
    this.showFlueGasModal = true;
    this.wallService.modalOpen.next(this.showFlueGasModal);
    this.flueGasModal.show();
  }

  hideFlueGasModal(calculatedAvailableHeat?: any) {
    if (calculatedAvailableHeat) {
      calculatedAvailableHeat = this.roundVal(calculatedAvailableHeat, 1);
      this.wallLossesForm.patchValue({
        availableHeat: calculatedAvailableHeat
      });
    }
    this.flueGasModal.hide();
    this.showFlueGasModal = false;
    this.wallService.modalOpen.next(this.showFlueGasModal);
  }

}