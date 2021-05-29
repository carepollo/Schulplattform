import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table'
import { Router } from '@angular/router';

import { PanelService } from "src/app/services/panel.service";
import { AcademicService } from "src/app/services/academic.service";
import { User } from 'src/app/models/User';
import { Person } from 'src/app/models/Person';
import { SelectOption } from "src/app/models/SelectOption";
import { BadgesTable } from "src/app/models/BadgeTable";


@Component({
  selector: 'app-view-academic',
  templateUrl: './view-academic.component.html',
  styleUrls: ['./view-academic.component.css']
})
export class ViewAcademicComponent implements OnInit {

  @Input() userdata: User
  @ViewChild(MatTable) badgesTable!: MatTable<any>

  gradesList:Array<string> = ['Primero','Segundo','Tercero','Cuarto','Quinto','Sexto','Séptimo','Octavo','Noveno','Décimo','Once']
  judgeLevelList:Array<string> = ['Superior','Alto','Básico','Bajo']
  assignatureList:Array<SelectOption>
  columnTitles:Array<string> = ["id","grade","level","assignature","description","actions"]
  currentBadges:Array<BadgesTable>
  disableAssignature:boolean = true
  disableAddBadge:boolean = true
  badgesForm:BadgesTable = {
    grade: "",
    assignature: "",
    level: "",
    description: ""
  }

  constructor(private academicService:AcademicService, private notifier:MatSnackBar) {
    this.userdata = {}
    this.assignatureList = []
    this.currentBadges = []
  }

  ngOnInit(): void {
    this.academicService.getTableList("logros").subscribe(
      response => {this.currentBadges = response},
      error => {console.warn(error)}
    )
  }

  unlockSelector(selection:string):void {
    this.disableAssignature = false
    this.academicService.getOptionList("dep_grados_materia", selection).subscribe(
      response => {this.assignatureList = response}
    )
  }

  unlockSend():void {
    let formFields:Array<string> = Object.values(this.badgesForm)
    let pass:boolean = false

    for (let i = 0; i < formFields.length; i++) {
      switch (formFields[i]) {
        case "":
          pass = false
          break;
        default:
          pass = true
          break;
      }
    }
    if (pass) {
      this.disableAddBadge = false
    }
  }

  insertBadge():void {
    this.academicService.insertBadge(this.badgesForm).subscribe(
      success => {
        this.notifier.open("Agregado", "OK", {duration: 3*1000})
        this.academicService.getTableList("logros").subscribe(
          response => {
            this.currentBadges = response
            this.badgesTable.renderRows()
          },
          error => {
            console.warn(error)
            this.notifier.open("Error", "OK", {duration: 3*1000})
          }
        )
      },
      error => {
        this.notifier.open("Error", "OK", {duration: 3*1000})
        console.warn(error)
      }
    )
  }

  updateBadge(selected:string):void {
    let selectedBadge:any = document.getElementsByClassName(selected)
    let badgeData:BadgesTable = {
      id: parseInt(selectedBadge[0].innerHTML),
      grade: selectedBadge[1].innerHTML,
      level: selectedBadge[2].innerHTML,
      description: selectedBadge[4].value,
      assignature: selectedBadge[3].innerHTML
    }
    this.academicService.updateBadgeData(badgeData).subscribe(
      response => {
        this.notifier.open("Actualizado", "OK", {duration: 3*1000})
      },
      error => {
        this.notifier.open("Error", "OK", {duration: 3*1000})
        console.warn(error)
      }
    )
  }
  
  deleteBadge(selected:number):void {
    this.academicService.deleteBadge(selected).subscribe(
      success => {
        this.currentBadges.forEach((value, index) => {
          switch (value.id) {
            case selected:
              this.currentBadges.splice(index, 1)
              this.badgesTable.renderRows()
              this.notifier.open("Eliminado", "OK", {duration: 3*1000})
              break;
            default:
              break;
          }
        })
      },
      error => {
        this.notifier.open("Error", "OK", {duration: 3*1000})
        console.warn(error)
      }
    )
  }

}