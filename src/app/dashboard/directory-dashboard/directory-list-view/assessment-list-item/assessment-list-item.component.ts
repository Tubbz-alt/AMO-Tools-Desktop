import { Component, OnInit, Input, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Assessment } from '../../../../shared/models/assessment';
import { Directory } from '../../../../shared/models/directory';
import { IndexedDbService } from '../../../../indexedDb/indexed-db.service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap';
import { AssessmentDbService } from '../../../../indexedDb/assessment-db.service';
import { Settings } from '../../../../shared/models/settings';
import { SettingsDbService } from '../../../../indexedDb/settings-db.service';
import { AssessmentService } from '../../../../assessment/assessment.service';
import { DirectoryDbService } from '../../../../indexedDb/directory-db.service';
import { DashboardService } from '../../../dashboard.service';

@Component({
  selector: 'app-assessment-list-item',
  templateUrl: './assessment-list-item.component.html',
  styleUrls: ['./assessment-list-item.component.css']
})
export class AssessmentListItemComponent implements OnInit {
  @Input()
  assessment: Assessment;

  @ViewChild('editModal', { static: false }) public editModal: ModalDirective;
  @ViewChild('copyModal', { static: false }) public copyModal: ModalDirective;
  @ViewChild('deleteModal', { static: false }) public deleteModal: ModalDirective;

  directories: Array<Directory>;

  editForm: FormGroup;
  isSetup: boolean;

  showReport: boolean = false;
  copyForm: FormGroup;

  dropdownOpen: boolean = false;
  assessmentCopy: Assessment;
  settingsCopy: Settings;

  @ViewChild('reportModal', { static: false }) public reportModal: ModalDirective;
  constructor(private assessmentService: AssessmentService, private dashboardService: DashboardService, private indexedDbService: IndexedDbService, private formBuilder: FormBuilder, private assessmentDbService: AssessmentDbService, private settingsDbService: SettingsDbService) { }

  ngOnInit() {
    if (this.assessment.phast) {
      this.isSetup = this.assessment.phast.setupDone;
    } else if (this.assessment.psat) {
      this.isSetup = this.assessment.psat.setupDone;
    } else if (this.assessment.fsat) {
      this.isSetup = this.assessment.fsat.setupDone;
    } else if (this.assessment.ssmt) {
      this.isSetup = this.assessment.ssmt.setupDone;
    } else if (this.assessment.treasureHunt) {
      this.isSetup = this.assessment.treasureHunt.setupDone;
    }

    this.indexedDbService.getAllDirectories().then(dirs => {
      this.directories = dirs;
    });

    this.assessmentCopy = JSON.parse(JSON.stringify(this.assessment));
    delete this.assessmentCopy.id;
    let tmpSettings: Settings = this.settingsDbService.getByAssessmentId(this.assessment);
    this.settingsCopy = JSON.parse(JSON.stringify(tmpSettings));
    delete this.settingsCopy.id;
  }

  goToAssessment(assessment: Assessment, str?: string, str2?: string) {
    this.assessmentService.goToAssessment(assessment, str, str2);
  }

  showEditModal() {
    this.editForm = this.formBuilder.group({
      'name': [this.assessment.name],
      'directoryId': [this.assessment.directoryId]
    });
    this.editModal.show();
  }

  hideEditModal() {
    this.editModal.hide();
  }

  getParentDirStr(id: number) {
    let parentDir = _.find(this.directories, (dir) => { return dir.id === id; });
    let str = parentDir.name + '/';
    while (parentDir.parentDirectoryId) {
      parentDir = _.find(this.directories, (dir) => { return dir.id === parentDir.parentDirectoryId; });
      str = parentDir.name + '/' + str;
    }
    return str;
  }

  save() {
    this.assessment.name = this.editForm.controls.name.value;
    this.assessment.directoryId = this.editForm.controls.directoryId.value;
    this.indexedDbService.putAssessment(this.assessment).then(val => {
      this.assessmentDbService.setAll().then(() => {
        this.dashboardService.updateSidebarData.next(true);
        this.hideEditModal();
      });
    });
  }

  showReportModal() {
    this.showReport = true;
    this.reportModal.show();
  }

  hideReportModal() {
    this.reportModal.hide();
    this.showReport = false;
  }

  showDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  showCopyModal() {
    this.indexedDbService.getAllDirectories().then(dirs => {
      this.directories = dirs;
      this.copyForm = this.formBuilder.group({
        'name': [this.assessment.name + ' (copy)', Validators.required],
        'directoryId': [this.assessment.directoryId, Validators.required]
      });
      this.copyModal.show();
    });
  }

  hideCopyModal() {
    this.copyModal.hide();
  }

  createCopy() {
    this.assessmentCopy.name = this.copyForm.controls.name.value;
    this.assessmentCopy.directoryId = this.copyForm.controls.directoryId.value;
    this.assessmentCopy.createdDate = new Date();
    this.assessmentCopy.modifiedDate = new Date();
    this.indexedDbService.addAssessment(this.assessmentCopy).then(newAssessmentId => {
      this.settingsCopy.assessmentId = newAssessmentId;
      this.indexedDbService.addSettings(this.settingsCopy).then(() => {
        this.settingsDbService.setAll().then(() => {
          this.assessmentDbService.setAll().then(() => {
            this.hideCopyModal();
          });
        });
      });
    });
  }

  showDeleteModal() {
    this.deleteModal.show();
  }

  hideDeleteModal() {
    this.deleteModal.hide();
  }

  deleteAssessment() {
    let deleteSettings: Settings = this.settingsDbService.getByAssessmentId(this.assessment);
    this.indexedDbService.deleteAssessment(this.assessment.id).then(() => {
      this.indexedDbService.deleteSettings(deleteSettings.id).then(() => {
        this.assessmentDbService.setAll().then(() => {
          this.settingsDbService.setAll().then(() => {
            this.hideDeleteModal();
          });
        });
      });
    });
  }
}