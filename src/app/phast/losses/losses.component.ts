import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter, ElementRef, ViewChild, HostListener } from '@angular/core';
import { PHAST } from '../../shared/models/phast/phast';
import { Settings } from '../../shared/models/settings';

import * as _ from 'lodash';
import { LossesService } from './losses.service';
import { LossTab } from '../tabs';
import { PhastCompareService } from '../phast-compare.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-losses',
  templateUrl: 'losses.component.html',
  styleUrls: ['losses.component.css']
})
export class LossesComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  saveClicked: boolean;
  @Output('saved')
  saved = new EventEmitter<boolean>();
  @Input()
  settings: Settings;
  @Input()
  inSetup: boolean;
  lossAdded: boolean;
  @Input()
  containerHeight: number;
  @Input()
  modificationIndex: number;

  @ViewChild('modificationHeader', { static: false }) modificationHeader: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.getHeaderHeight();
  }

  // _modifications: Modification[];
  baselineSelected: boolean = true;
  modificationSelected: boolean = false;
  selectedTab: LossTab;
  currentField: string = 'default';
  addLossToggle: boolean = false;
  showNotes: boolean = false;
  isLossesSetup: boolean;
  toggleCalculate: boolean = false;
  modificationExists: boolean = false;
  lossesTabs: Array<LossTab>;
  lossTabSubscription: Subscription;
  modalOpenSubscription: Subscription;
  isModalOpen: boolean = false;
  headerHeight: number;
  constructor(private lossesService: LossesService, private phastCompareService: PhastCompareService) {
  }

  ngOnInit() {
    this.lossesTabs = this.lossesService.lossesTabs;
    // this._modifications = new Array<Modification>();
    if (!this.phast.losses) {
      //initialize losses
      this.phast.losses = {};
    } else {
      this.phast.disableSetupDialog = true;
    }

    this.lossTabSubscription = this.lossesService.lossesTab.subscribe(val => {
      this.changeField('default');
      this.selectedTab = _.find(this.lossesTabs, (t) => { return val === t.step; });
    });

    if (!this.inSetup) {
      this.baselineSelected = false;
      this.modificationSelected = true;
    }
    this.modalOpenSubscription = this.lossesService.modalOpen.subscribe(val => {
      this.isModalOpen = val;
    });
    this.lossesService.updateTabs.next(true);
    this.saveModifications(true);
  }


  ngOnDestroy() {
    if (this.lossTabSubscription) this.lossTabSubscription.unsubscribe();
    this.modalOpenSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.modificationIndex) {
      this.toggleCalculate = !this.toggleCalculate;
    }
  }

  ngAfterViewInit() {
    //after init show disclaimer toasty
    setTimeout(() => {
      //initialize container height after content is rendered
      this.getHeaderHeight();
    }, 100);
  }

  getHeaderHeight() {
    if (this.modificationHeader) {
      this.headerHeight = this.modificationHeader.nativeElement.clientHeight;
    }
  }

  changeField($event) {
    this.currentField = $event;
  }

  saveModifications(bool?: boolean) {
    if (this.phast.modifications[this.modificationIndex] && !bool) {
      if (this.phast.modifications[this.modificationIndex].exploreOpportunities) {
        this.phast.modifications[this.modificationIndex].exploreOpportunities = false;
      }
    }
    this.phastCompareService.setCompareVals(this.phast, this.modificationIndex, this.inSetup);
    this.saved.emit(true);
    this.toggleCalculate = !this.toggleCalculate;
    if (this.phast.modifications.length !== 0) {
      this.modificationExists = true;
    } else {
      this.modificationExists = false;
    }
  }

  addLoss() {
    this.phast.disableSetupDialog = true;
    if (this.baselineSelected) {
      this.lossAdded = true;
      this.addLossToggle = !this.addLossToggle;
    }
  }

  toggleNotes() {
    this.showNotes = !this.showNotes;
  }

  togglePanel(bool: boolean) {
    if (bool === this.baselineSelected) {
      this.baselineSelected = true;
      this.modificationSelected = false;
    }
    else if (bool === this.modificationSelected) {
      this.modificationSelected = true;
      this.baselineSelected = false;
    }
  }

  hideSetupDialog() {
    this.saved.emit(true);
    this.phast.disableSetupDialog = true;
  }

  newModification() {
    this.lossesService.openNewModal.next(true);
  }
}
