import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ReplaceExistingResults } from '../../../../shared/models/calculators';

@Component({
  selector: 'app-replace-existing-results',
  templateUrl: './replace-existing-results.component.html',
  styleUrls: ['./replace-existing-results.component.css']
})
export class ReplaceExistingResultsComponent implements OnInit {
  @Input()
  results: ReplaceExistingResults;
  @Input()
  inTreasureHunt: boolean;

  @ViewChild('copyTable', { static: false }) copyTable: ElementRef;
  tableString: any;
  @ViewChild('copyTable2', { static: false }) copyTable2: ElementRef;
  tableString2: any;

  numCols: number = 2;
  constructor() { }

  ngOnInit() {
    if (this.inTreasureHunt) {
      this.numCols = 1;
    }
  }

  updateTableString() {
    this.tableString = this.copyTable.nativeElement.innerText;
  }
  
  updateTableString2() {
    this.tableString2 = this.copyTable2.nativeElement.innerText;
  }
}
