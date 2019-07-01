import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Plane } from '../../../../../../shared/models/fans';
import { FormGroup } from '@angular/forms';
import { PlaneDataFormService } from '../plane-data-form.service';
import { FanAnalysisService } from '../../../fan-analysis.service';

@Component({
  selector: 'app-plane-three-form',
  templateUrl: './plane-three-form.component.html',
  styleUrls: ['./plane-three-form.component.css']
})
export class PlaneThreeFormComponent implements OnInit {
  @Input()
  planeNum: string;
 
  planeData: Plane;
  pitotDataForm: FormGroup;
  pressureReadings: Array<Array<number>>;
  constructor(private planeDataFormService: PlaneDataFormService, private fanAnalysisService: FanAnalysisService) { }

  ngOnInit() {
    this.setPlaneData();
    this.pitotDataForm = this.planeDataFormService.getTraversePlaneFormFromObj(this.planeData);
  }

  setPlaneData() {
    this.planeData = this.fanAnalysisService.getPlane(this.planeNum);
  }

  save() {
    this.planeData = this.planeDataFormService.getTraversePlaneObjFromForm(this.pitotDataForm, this.planeData);
    this.fanAnalysisService.setPlane(this.planeNum, this.planeData);
    this.fanAnalysisService.getResults.next(true);
  }


  setCoefficient() {
    if (this.pitotDataForm.controls.pitotTubeType.value === 'Standard') {
      this.pitotDataForm.patchValue({
        pitotTubeCoefficient: 1
      });
    } else if (this.pitotDataForm.controls.pitotTubeType.value === 'S-Type') {
      this.pitotDataForm.patchValue({
        pitotTubeCoefficient: .86
      });
    }
    this.save();
  }

  focusField(str: string) {
    this.fanAnalysisService.currentField.next(str);
  }
}
