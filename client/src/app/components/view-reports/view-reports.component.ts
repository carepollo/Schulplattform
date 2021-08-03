import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

import { AcademicService } from 'src/app/services/academic.service';
import { ReportsService } from "src/app/services/reports.service";
import { SelectOption } from "src/app/models/SelectOption";
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-view-reports',
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css']
})
export class ViewReportsComponent implements OnInit {

  @Input() userdata: User = {}

  public groupsList:Array<SelectOption> = []
  public reportData:any = {
    target: 0,
    method: "",
    parameter: new Date().getFullYear()
  }
  public currentReport:string = ""
  public datasource:any = {}

  constructor(
    private academicService: AcademicService,
    public notifier:MatSnackBar,
    private reportsService:ReportsService
  ) { }

  ngOnInit(): void {
    this.academicService.getOptionList("gruposTotal", "*").subscribe(
      response => {this.groupsList = response},
      error => {
        this.notifier.open("Error cargando los grupos", "OK", {duration: 3*1000})
        console.error(error)
      }
    )
  }


}
