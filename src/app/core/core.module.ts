import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxElectronModule } from 'ngx-electron';
import { AssessmentModule } from '../assessment/assessment.module';
import { PhastModule } from '../phast/phast.module';
import { PsatModule } from '../psat/psat.module';
import { CalculatorModule } from '../calculator/calculator.module';
import { ModalModule } from 'ngx-bootstrap';

import { CoreComponent } from './core.component';
import { AssessmentService } from '../assessment/assessment.service';
import { SettingsModule } from '../settings/settings.module';

import { SuiteDbModule } from '../suiteDb/suiteDb.module';
import { ReportRollupModule } from '../report-rollup/report-rollup.module';
import { FsatModule } from '../fsat/fsat.module';
import { PreAssessmentModule } from '../calculator/utilities/pre-assessment/pre-assessment.module';
import { WindowRefService } from '../indexedDb/window-ref.service';
import { IndexedDbService } from '../indexedDb/indexed-db.service';
import { AssessmentDbService } from '../indexedDb/assessment-db.service';
import { DirectoryDbService } from '../indexedDb/directory-db.service';
import { SettingsDbService } from '../indexedDb/settings-db.service';
import { CalculatorDbService } from '../indexedDb/calculator-db.service';
import { DeleteDataService } from '../indexedDb/delete-data.service';
import { CoreService } from './core.service';
import { SsmtModule } from '../ssmt/ssmt.module';
import { TreasureHuntModule } from '../treasure-hunt/treasure-hunt.module';
import { HelperServicesModule } from '../shared/helper-services/helper-services.module';
import { ToastModule } from '../shared/toast/toast.module';
import { TutorialsModule } from '../tutorials/tutorials.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { UpdateToastComponent } from '../update-toast/update-toast.component';

@NgModule({
  declarations: [
    CoreComponent,
    UpdateToastComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    AssessmentModule,
    PsatModule,
    PhastModule,
    CalculatorModule,
    ModalModule,
    NgxElectronModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsModule,
    SuiteDbModule,
    ReportRollupModule,
    FsatModule,
    PreAssessmentModule,
    SsmtModule,
    TreasureHuntModule,
    HelperServicesModule,
    ToastModule,
    TutorialsModule,
    DashboardModule
  ],
  providers: [
    AssessmentService,
    CoreService,
    WindowRefService,
    IndexedDbService,
    AssessmentDbService,
    DirectoryDbService,
    SettingsDbService,
    CalculatorDbService,
    DeleteDataService
  ]
})

export class CoreModule { };
