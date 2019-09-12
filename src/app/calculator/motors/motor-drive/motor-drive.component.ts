import { Component, OnInit, ViewChild, HostListener, ElementRef, Input, EventEmitter, Output } from '@angular/core';
import { MotorDriveService } from './motor-drive.service';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { Settings } from '../../../shared/models/settings';
import { MotorDriveInputs, MotorDriveOutputs } from '../../../shared/models/calculators';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-motor-drive',
  templateUrl: './motor-drive.component.html',
  styleUrls: ['./motor-drive.component.css']
})
export class MotorDriveComponent implements OnInit {
  @Input()
  inTreasureHunt: boolean;
  @Output('emitSave')
  emitSave = new EventEmitter<MotorDriveInputs>();
  @Output('emitCancel')
  emitCancel = new EventEmitter<boolean>();
  @Output('emitAddOpportunitySheet')
  emitAddOpportunitySheet = new EventEmitter<boolean>();
  @Input()
  settings: Settings;
  @Input()
  opperatingHours: number

  @ViewChild('leftPanelHeader', { static: false }) leftPanelHeader: ElementRef;
  @ViewChild('contentContainer', { static: false }) contentContainer: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  motorDriveData: MotorDriveInputs;
  motorDriveForm: FormGroup;
  outputData: MotorDriveOutputs;
  tabSelect: string = 'results';
  currentField: string;
  headerHeight: number;
  percentSavings: number;
  containerHeight: number;
  constructor(private motorDriveService: MotorDriveService, private settingsDbService: SettingsDbService) { }

  ngOnInit() {
    if(!this.settings){
      this.settings = this.settingsDbService.globalSettings;
    }
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (this.motorDriveService.motorDriveData) {
      this.motorDriveData = this.motorDriveService.motorDriveData;
    }else{
      this.motorDriveData = this.motorDriveService.getDefaultData(this.settings);
    }
    this.motorDriveForm = this.motorDriveService.getFormFromObj(this.motorDriveData);
    this.calculate(this.motorDriveData);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  ngOnDestroy(){
    if(!this.inTreasureHunt){
      this.motorDriveService.motorDriveData = this.motorDriveData;
    }else{
      this.motorDriveService.motorDriveData = undefined;
    }
  }

  btnResetData() {
    this.motorDriveData = this.motorDriveService.getDefaultData(this.settings);
    this.motorDriveForm = this.motorDriveService.getFormFromObj(this.motorDriveData);
    this.calculate(this.motorDriveData);
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
      this.containerHeight = this.contentContainer.nativeElement.clientHeight - this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  calculate(data: MotorDriveInputs) {
    this.motorDriveData = data;
    this.motorDriveService.motorDriveData = this.motorDriveData;
    this.outputData = this.motorDriveService.getResults(data);
    this.percentSavings = ((this.outputData.baselineResult.energyCost - this.outputData.modificationResult.energyCost) / this.outputData.baselineResult.energyCost) * 100;
  }

  setTab(str: string) {
    this.tabSelect = str;
  }
  changeField(str: string) {
    this.currentField = str;
  }

  save() {
    this.emitSave.emit(this.motorDriveData);
  }

  cancel() {
    this.emitCancel.emit(true);
  }

  addOpportunitySheet() {
    this.emitAddOpportunitySheet.emit(true);
  }
}


