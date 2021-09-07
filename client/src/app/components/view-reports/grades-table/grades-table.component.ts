import { Component, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { MatSnackBar } from "@angular/material/snack-bar";
import { ReportsService } from 'src/app/services/reports.service';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;


export interface GradeSummary {
  name: string;
  id: number;
  data?: any;
}

@Component({
  selector: 'grades-table',
  templateUrl: './grades-table.component.html',
  styleUrls: ['./grades-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: "0px", minHeight: "0"})),
      state('expanded', style({height: "*"})),
      transition('expanded <=> collapsed', animate("225ms cubic-bezier(0.4,0.0,.2,1)"))
    ])
  ]
})
export class GradesTableComponent implements OnInit {

  @Input() dataSource: any = {}

  public visibleFields = ["id", "name", "total", "actions"]
  public expandedElement: any | null
  
  constructor(
    private reportsService:ReportsService,
    private notifer:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.reportsService.getReport(this.dataSource).subscribe(
      success => {
        if(success.status == 200) {
          this.dataSource.data = success.message
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
    let requestData:any = {}
    if (data.parameter != undefined) {
      requestData.person = "*"
      requestData.period = data.parameter
      requestData.group = data.target
    }
    else {
      requestData.person = data.id
      requestData.period = this.dataSource.parameter
    }
    this.reportsService.getPdfData(requestData).subscribe(
      response => {
        if (response.status == 200) {
          try {
            this.notifer.open("Generando archivo", "OK", {duration: 1500})
            const documentDefinition = this.reportsService.setPdfConfig(response.message)
            
            pdfMake.createPdf(documentDefinition).open();
          }
          catch (error) {
            console.log(error)
            this.notifer.open("No se pudo crear el archivo", "OK", {duration: 3000})
          }
          
        }
        else {
          this.notifer.open(response.message, "OK", {duration: 3000})
        }
      },
      error => {
        console.log(error)
        this.notifer.open("No se pudo obtener los datos", "OK", {duration: 3000})
      }
    )
  }

}