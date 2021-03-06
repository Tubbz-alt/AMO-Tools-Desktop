import { Component, OnInit, ElementRef, ViewChild, HostListener, Input } from '@angular/core';
import { BoilerBlowdownRateService, BoilerBlowdownRateInputs } from './boiler-blowdown-rate.service';
import { Subscription } from 'rxjs';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { Settings } from '../../../shared/models/settings';

@Component({
  selector: 'app-boiler-blowdown-rate',
  templateUrl: './boiler-blowdown-rate.component.html',
  styleUrls: ['./boiler-blowdown-rate.component.css']
})
export class BoilerBlowdownRateComponent implements OnInit {
  @Input()
  settings: Settings;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }
  @ViewChild('leftPanelHeader', { static: false }) leftPanelHeader: ElementRef;

  baselineInputs: BoilerBlowdownRateInputs;
  modificationInputs: BoilerBlowdownRateInputs;
  modificationExists: boolean = false;
  modificationSub: Subscription;
  baselineSelected: boolean = true;
  tabSelect: string = 'results';
  headerHeight: number;
  constructor(private boilerBlowdownRateService: BoilerBlowdownRateService, private settingsDbService: SettingsDbService) { }

  ngOnInit() {
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    this.initData();
    this.modificationSub = this.boilerBlowdownRateService.modificationInputs.subscribe(val => {
      if (val) {
        this.modificationExists = true;
      } else {
        this.modificationExists = false;
      }
    })
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  ngOnDestroy() {
    this.modificationSub.unsubscribe();
  }

  initData() {
    let baselineInputs: BoilerBlowdownRateInputs = this.boilerBlowdownRateService.baselineInputs.getValue();
    if (baselineInputs == undefined) {
      baselineInputs = this.boilerBlowdownRateService.getDefaultInputs();
    }
    this.boilerBlowdownRateService.baselineInputs.next(baselineInputs);
  }

  createModification() {
    let baselineInputs: BoilerBlowdownRateInputs = this.boilerBlowdownRateService.baselineInputs.getValue();
    this.boilerBlowdownRateService.modificationInputs.next(baselineInputs);
    this.setModificationSelected();
  }

  setModificationSelected() {
    this.baselineSelected = false;
  }

  setBaselineSelected() {
    this.baselineSelected = true;
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  setTab(str: string) {
    this.tabSelect = str;
  }

  btnResetData() {
    this.boilerBlowdownRateService.modificationInputs.next(undefined);
    let baselineInputs: BoilerBlowdownRateInputs = this.boilerBlowdownRateService.getDefaultInputs();
    this.boilerBlowdownRateService.baselineInputs.next(baselineInputs);
    this.boilerBlowdownRateService.showBoiler.next(false);
    this.boilerBlowdownRateService.showOperations.next(false);
    this.boilerBlowdownRateService.setForms.next(true);
    this.boilerBlowdownRateService.operatingHours.next(undefined);
  }

  btnGenerateExample() {
    let exampleData: { baseline: BoilerBlowdownRateInputs, modification: BoilerBlowdownRateInputs } = this.boilerBlowdownRateService.getExampleInputs(this.settings);
    this.boilerBlowdownRateService.modificationInputs.next(exampleData.modification);
    this.boilerBlowdownRateService.baselineInputs.next(exampleData.baseline);
    this.boilerBlowdownRateService.showBoiler.next(true);
    this.boilerBlowdownRateService.showOperations.next(true);
    this.boilerBlowdownRateService.setForms.next(true);
  }
}
