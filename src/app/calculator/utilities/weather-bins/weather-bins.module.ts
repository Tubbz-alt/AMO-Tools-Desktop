import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherBinsComponent } from './weather-bins.component';
import { FormsModule } from '@angular/forms';
import { WeatherBinsService } from './weather-bins.service';
import { WeatherBinsFormComponent } from './weather-bins-form/weather-bins-form.component';
import { WeatherBinsHelpComponent } from './weather-bins-help/weather-bins-help.component';
import { DataSetupFormComponent } from './weather-bins-form/data-setup-form/data-setup-form.component';
import { CaseFormComponent } from './weather-bins-form/case-form/case-form.component';
import { WeatherBinsBarChartComponent } from './weather-bins-bar-chart/weather-bins-bar-chart.component';



@NgModule({
  declarations: [WeatherBinsComponent, WeatherBinsFormComponent, WeatherBinsHelpComponent, DataSetupFormComponent, CaseFormComponent, WeatherBinsBarChartComponent],
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    WeatherBinsService
  ]
})
export class WeatherBinsModule { }
