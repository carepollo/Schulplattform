import { Component, OnInit, Input } from '@angular/core';

import { MatSnackBar } from "@angular/material/snack-bar";
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'grades-table',
  templateUrl: './grades-table.component.html',
  styleUrls: ['./grades-table.component.css']
})
export class GradesTableComponent implements OnInit {

  @Input() dataSource: any = {}

  constructor() { }

  ngOnInit(): void {
  }

  checkValidity():boolean {
    for (const prop in this.dataSource) {
      if(this.dataSource[prop] == 0 || this.dataSource[prop] == "") {
        return false
      }
    }
    return true
  }

}
