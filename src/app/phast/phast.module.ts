import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';
import { ToastyModule } from 'ng2-toasty';
import { MeteredEnergyModule } from './metered-energy/metered-energy.module';
import { LossesModule } from './losses/losses.module';
import { DesignedEnergyModule } from './designed-energy/designed-energy.module';
import { PhastComponent } from './phast.component';
import { PhastBannerComponent } from './phast-banner/phast-banner.component';

import { SystemBasicsComponent } from './system-basics/system-basics.component';
import { OperatingHoursComponent } from './operating-hours/operating-hours.component';
import { PhastTabsComponent } from './phast-tabs/phast-tabs.component';
import { HelpPanelComponent } from './help-panel/help-panel.component';

import { PhastService } from './phast.service';
import { SystemSetupComponent } from './system-setup/system-setup.component';
import { SettingsModule } from '../settings/settings.module';
import { AuxEquipmentModule } from './aux-equipment/aux-equipment.module';
import { SankeyModule } from './sankey/sankey.module';
import { PhastReportModule } from './phast-report/phast-report.module';
import { PhastDiagramComponent } from './phast-diagram/phast-diagram.component';
import { PhastResultsService } from './phast-results.service';
@NgModule({
  declarations: [
    PhastComponent,
    PhastBannerComponent,
    PhastTabsComponent,
    SystemBasicsComponent,
    OperatingHoursComponent,
    HelpPanelComponent,
    SystemSetupComponent,
    PhastDiagramComponent
  ],
  exports: [
  ],
  imports: [
    RouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    ModalModule,
    LossesModule,
    ToastyModule,
    SettingsModule,
    AuxEquipmentModule,
    DesignedEnergyModule,
    MeteredEnergyModule,
    SankeyModule,
    PhastReportModule
  ],
  providers: [
    PhastService,
    PhastResultsService
  ]
})

export class PhastModule { }
