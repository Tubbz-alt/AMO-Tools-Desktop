import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PHAST, Modification } from '../../shared/models/phast/phast';
import { PhastService } from '../phast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-modification',
  templateUrl: './add-modification.component.html',
  styleUrls: ['./add-modification.component.css']
})
export class AddModificationComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  modifications: Array<Modification>;
  @Output('save')
  save = new EventEmitter<Modification>();
  @Input()
  modificationExists: boolean;



  newModificationName: string;
  currentTab: string;
  tabSubscription: Subscription;
  constructor(private phastService: PhastService) { }

  ngOnInit() {
    if (this.modifications) {
      this.newModificationName = 'Scenario ' + (this.modifications.length + 1);
    } else {
      this.newModificationName = 'Scenario 1';
    }
    this.tabSubscription = this.phastService.assessmentTab.subscribe(val => {
      this.currentTab = val;
    });
  }
  
  ngOnDestroy() {
    this.tabSubscription.unsubscribe();
  }

  addModification() {
    let tmpModification: Modification = {
      phast: {
        losses: {},
        name: this.newModificationName,
      },
      notes: {
        chargeNotes: '',
        wallNotes: '',
        atmosphereNotes: '',
        fixtureNotes: '',
        openingNotes: '',
        coolingNotes: '',
        flueGasNotes: '',
        otherNotes: '',
        leakageNotes: '',
        extendedNotes: '',
        slagNotes: '',
        auxiliaryPowerNotes: '',
        exhaustGasNotes: '',
        energyInputExhaustGasNotes: '',
        operationsNotes: ''
      }
    };
    if (this.currentTab === 'explore-opportunities') {
      tmpModification.exploreOpportunities = true;
    }
    tmpModification.phast.losses = (JSON.parse(JSON.stringify(this.phast.losses)));
    tmpModification.phast.operatingCosts = (JSON.parse(JSON.stringify(this.phast.operatingCosts)));
    tmpModification.phast.operatingHours = (JSON.parse(JSON.stringify(this.phast.operatingHours)));
    tmpModification.phast.systemEfficiency = (JSON.parse(JSON.stringify(this.phast.systemEfficiency)));
    this.save.emit(tmpModification);
  }
}
