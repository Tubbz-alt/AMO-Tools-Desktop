import { Component, OnInit, ViewChild, ViewChildren, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap';
import { Directory, DirectoryDbRef } from '../../shared/models/directory';
import { ModelService } from '../../shared/model.service';
import { Router } from '@angular/router';
import { AssessmentService } from '../assessment.service';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';
import * as _ from 'lodash';
@Component({
  selector: 'app-assessment-create',
  templateUrl: './assessment-create.component.html',
  styleUrls: ['./assessment-create.component.css']
})
export class AssessmentCreateComponent implements OnInit {
  @Input()
  directory: Directory;
  @ViewChildren('assessmentName') vc;
  @Output('hideModal')
  hideModal = new EventEmitter<boolean>();


  newAssessment: any;
  selectedEquip: string = 'new';
  showDropdown: boolean = false;
  selectedAssessment: string = 'Select Pump';
  allAssessments: any[] = new Array();
  filteredAssessments: any[] = new Array();

  constructor(
    private formBuilder: FormBuilder,
    private assessmentService: AssessmentService,
    private modelService: ModelService,
    private router: Router,
    private indexedDbService: IndexedDbService) { }

  ngOnInit() {
    this.newAssessment = this.initForm();
    this.allAssessments = this.directory.assessments;
    this.filteredAssessments = this.allAssessments;
  }

  ngAfterViewInit() {
    this.showCreateModal();
  }

  initForm() {
    return this.formBuilder.group({
      'assessmentName': ['New Assessment', Validators.required],
      'assessmentType': ['Pump', Validators.required]
    });
  }

  //  CREATE ASSESSMENT MODAL
  @ViewChild('createModal') public createModal: ModalDirective;
  showCreateModal() {
    this.createModal.show();
    this.createModal.onShown.subscribe(() => {
      this.vc.first.nativeElement.select();
    })
  }

  hideCreateModal() {
    this.showDropdown = false;
    this.createModal.hide();
    this.hideModal.emit(true);

  }

  createAssessment() {
    this.hideCreateModal();

    this.createModal.onHidden.subscribe(() => {
      this.assessmentService.tab = 'system-setup';
      if (this.newAssessment.value.assessmentType == 'Pump') {
        let tmpAssessment = this.assessmentService.getNewAssessment('PSAT');
        tmpAssessment.name = this.newAssessment.value.assessmentName;

        let tmpPsat = this.assessmentService.getNewPsat();
        tmpAssessment.psat = tmpPsat;
        tmpAssessment.directoryId = this.directory.id;
        this.indexedDbService.addAssessment(tmpAssessment).then(assessmentId => {
          this.indexedDbService.getAssessment(assessmentId).then(assessment => {
            tmpAssessment = assessment;
            if (this.directory.assessments) {
              this.directory.assessments.push(tmpAssessment);
            } else {
              this.directory.assessments = new Array();
              this.directory.assessments.push(tmpAssessment);
            }
            let tmpSubIds = new Array();
            let tmpAssIds = new Array();
            if (this.directory.subDirectory) {
              this.directory.subDirectory.forEach(dir => {
                tmpSubIds.push(dir.id);
              })
            }
            if (this.directory.assessments) {
              this.directory.assessments.forEach(assessment => {
                tmpAssIds.push(assessment.id);
              })
            }
            let tmpDirRef: DirectoryDbRef = {
              name: this.directory.name,
              id: this.directory.id,
              parentDirectoryId: this.directory.parentDirectoryId,
              subDirectoryIds: tmpSubIds,
              assessmentIds: tmpAssIds,
              createdDate: this.directory.createdDate,
              modifiedDate: this.directory.modifiedDate
            }

            this.indexedDbService.putDirectory(tmpDirRef).then(results => {
              this.router.navigateByUrl('/psat/' + tmpAssessment.id)
            });
          })
        });
      }
      else if (this.newAssessment.value.assessmentType == 'Furnace') {
        let tmpAssessment = this.assessmentService.getNewAssessment('PHAST');
        tmpAssessment.name = this.newAssessment.value.assessmentName;

        let tmpPhast = this.assessmentService.getNewPhast();
        tmpAssessment.phast = tmpPhast;
        tmpAssessment.directoryId = this.directory.id;
        this.indexedDbService.addAssessment(tmpAssessment).then(assessmentId => {
          this.indexedDbService.getAssessment(assessmentId).then(assessment => {
            tmpAssessment = assessment;
            if (this.directory.assessments) {
              this.directory.assessments.push(tmpAssessment);
            } else {
              this.directory.assessments = new Array();
              this.directory.assessments.push(tmpAssessment);
            }
            let tmpSubIds = new Array();
            let tmpAssIds = new Array();
            if (this.directory.subDirectory) {
              this.directory.subDirectory.forEach(dir => {
                tmpSubIds.push(dir.id);
              })
            }
            if (this.directory.assessments) {
              this.directory.assessments.forEach(assessment => {
                tmpAssIds.push(assessment.id);
              })
            }
            let tmpDirRef: DirectoryDbRef = {
              name: this.directory.name,
              id: this.directory.id,
              parentDirectoryId: this.directory.parentDirectoryId,
              subDirectoryIds: tmpSubIds,
              assessmentIds: tmpAssIds,
              createdDate: this.directory.createdDate,
              modifiedDate: this.directory.modifiedDate
            }
            this.indexedDbService.putDirectory(tmpDirRef).then(results => {
              this.router.navigateByUrl('/phast/' + tmpAssessment.id)
            });
          })
        });
      }
    })
  }

  selectEquip(eq: string) {
    this.selectedEquip = eq;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  setAssessment(psatName: string) {
    this.selectedAssessment = psatName;
    this.toggleDropdown();
  }

  onKey(str: string) {
    if (str != '') {
      let temp = this.allAssessments.filter(f => f.name.toLowerCase().indexOf(str.toLowerCase()) >= 0);
      if (temp.length != 0) {
        this.filteredAssessments = temp;
      } else {
        this.filteredAssessments = this.allAssessments;
      }
    } else {
      this.filteredAssessments = this.allAssessments;
    }
  }

}
