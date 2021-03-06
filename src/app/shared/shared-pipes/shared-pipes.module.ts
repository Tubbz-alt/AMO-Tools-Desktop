import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhonePipe } from './phone.pipe';
import { SettingsLabelPipe } from './settings-label.pipe';
import { SigFigsPipe } from './sig-figs.pipe';
import { OptionDisplayValuePipe } from './option-display-value.pipe';
import { MotorEfficiencyClassPipe } from './motor-efficiency-class.pipe';
import { MotorDriveTypePipe } from './motor-drive-type.pipe';



@NgModule({
  declarations: [
    PhonePipe,
    SettingsLabelPipe,
    SigFigsPipe,
    OptionDisplayValuePipe,
    MotorEfficiencyClassPipe,
    MotorDriveTypePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PhonePipe,
    SettingsLabelPipe,
    SigFigsPipe,
    OptionDisplayValuePipe,
    MotorEfficiencyClassPipe,
    MotorDriveTypePipe
  ]
})
export class SharedPipesModule { }
