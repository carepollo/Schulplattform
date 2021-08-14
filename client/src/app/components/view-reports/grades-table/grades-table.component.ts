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

  public visibleFields = ["id", "name", "total", "actions"]
  
  constructor(
    private reportsService:ReportsService,
    private notifer:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reportsService.getReport(this.dataSource).subscribe(
      success => {
        if(success.status == 200) {
          this.dataSource.data = success.message
          console.log(this.dataSource)
        }
        else{
          this.notifer.open(success.message, "OK", {duration:3000})
        }
      },
      error => {this.notifer.open("Error trayendo los datos", "OK", {duration:3000})}
    )
  }

  checkValidity():boolean {
    for (const prop in this.dataSource) {
      if(this.dataSource[prop] == 0 || this.dataSource[prop] == "") {
        return false
      }
    }
    return true
  }

  downloadReport(data:any):void {
    console.log(data)
  }

}
