import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { WasteWater, WasteWaterData } from '../../shared/models/waste-water';
import { WasteWaterService } from '../waste-water.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-modification-list-modal',
  templateUrl: './modification-list-modal.component.html',
  styleUrls: ['./modification-list-modal.component.css']
})
export class ModificationListModalComponent implements OnInit {

  @ViewChild('modificationListModal', { static: false }) public modificationListModal: ModalDirective;
  wasteWater: WasteWater;
  wasteWaterSub: Subscription;
  selectedModificationId: string;
  selectedModificationIdSub: Subscription;

  deleteModificationId: string;
  renameModificationId: string;
  dropdownId: string;
  newModificationName: string;
  renameModificationName: string;
  constructor(private wasteWaterService: WasteWaterService) { }

  ngOnInit(): void {
    this.wasteWaterService.isModalOpen.next(true);
    this.selectedModificationIdSub = this.wasteWaterService.selectedModificationId.subscribe(val => {
      this.selectedModificationId = val;
    });
    this.wasteWaterSub = this.wasteWaterService.wasteWater.subscribe(val => {
      this.wasteWater = val;
    });
  }

  ngOnDestroy() {
    this.wasteWaterSub.unsubscribe();
    this.selectedModificationIdSub.unsubscribe();
  }

  ngAfterViewInit() {
    this.modificationListModal.show();
  }

  closeModal() {
    this.wasteWaterService.isModalOpen.next(false);
    this.wasteWaterService.showModificationListModal.next(false);
    this.modificationListModal.hide();
  }

  confirmDelete() {
    let deleteModIndex: number = this.wasteWater.modifications.findIndex(modification => { return modification.id == this.deleteModificationId });
    this.wasteWater.modifications.splice(deleteModIndex, 1);
    if (this.deleteModificationId == this.selectedModificationId) {
      if (this.wasteWater.modifications.length != 0) {
        this.wasteWaterService.selectedModificationId.next(this.wasteWater.modifications[0].id);
      } else {
        this.wasteWaterService.selectedModificationId.next(undefined);
      }
    }
    this.wasteWaterService.wasteWater.next(this.wasteWater);
    this.deleteModificationId = undefined;
  }

  cancelDelete() {
    this.deleteModificationId = undefined;
  }

  showDropdown(modId: string) {
    if (!this.dropdownId) {
      this.dropdownId = modId;
    } else {
      this.dropdownId = undefined;
    }
  }

  selectModification(modId: string) {
    this.wasteWaterService.selectedModificationId.next(modId);
    this.wasteWaterService.wasteWater.next(this.wasteWater);
    this.closeModal();
  }

  saveUpdates() {
    let renameModIndex: number = this.wasteWater.modifications.findIndex(modification => { return modification.id == this.renameModificationId });
    this.wasteWater.modifications[renameModIndex].name = this.renameModificationName;
    this.wasteWaterService.wasteWater.next(this.wasteWater);
    this.renameModificationId = undefined;
  }

  createCopy(wasteWaterData: WasteWaterData) {
    let modificationCopy: WasteWaterData = JSON.parse(JSON.stringify(wasteWaterData));
    let testName = _.filter(this.wasteWater.modifications, (mod) => { return mod.name.includes(modificationCopy.name); });
    if (testName) {
      modificationCopy.name = modificationCopy.name + '(' + testName.length + ')';
    }
    modificationCopy.id = Math.random().toString(36).substr(2, 9);
    this.wasteWater.modifications.push(modificationCopy);
    this.wasteWaterService.wasteWater.next(this.wasteWater);
    this.wasteWaterService.selectedModificationId.next(modificationCopy.id);
  }

  selectDelete(modId: string) {
    this.deleteModificationId = modId;
    this.dropdownId = undefined;
  }

  selectRename(wasteWaterData: WasteWaterData) {
    this.renameModificationName = wasteWaterData.name;
    this.renameModificationId = wasteWaterData.id;
    this.dropdownId = undefined;
  }

  addNewModification() {
    let modification: WasteWaterData = JSON.parse(JSON.stringify(this.wasteWater.baselineData));
    modification.name = this.newModificationName;
    modification.id = Math.random().toString(36).substr(2, 9);
    this.wasteWater.modifications.push(modification);
    this.wasteWaterService.wasteWater.next(this.wasteWater);
    this.wasteWaterService.selectedModificationId.next(modification.id);
    this.closeModal();
  }
}
