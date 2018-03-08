import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuxEquipment } from '../../../shared/models/phast/auxEquipment';
@Component({
  selector: 'app-aux-equipment-form',
  templateUrl: './aux-equipment-form.component.html',
  styleUrls: ['./aux-equipment-form.component.css']
})
export class AuxEquipmentFormComponent implements OnInit {
  @Input()
  equipment: AuxEquipment;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<boolean>();
  @Output('emitSave')
  emitSave = new EventEmitter<boolean>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  voltageError: string = null;
  constructor() { }

  ngOnInit() {
    this.checkVoltageError(true);
  }

  checkVoltageError(bool?: boolean) {
    if (!bool) {
      this.save();
      this.emitCalculate.emit(true);
    }
    if (this.equipment.supplyVoltage < 0 || this.equipment.supplyVoltage > 480) {
      this.voltageError = 'Supply Voltage must be between 0 and 480';
    } else {
      this.voltageError = null;
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  calculate() {
    this.save();
    this.emitCalculate.emit(true);
  }

  save() {
    this.emitSave.emit(true);
  }
}
