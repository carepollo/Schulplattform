import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table'
import { Router } from '@angular/router';

import { PanelService } from "src/app/services/panel.service";
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
  // @ViewChild(MatTable) badgesTable: MatTable<any>

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

  constructor(private panelService:PanelService, private notifier:MatSnackBar) {
    this.userdata = {}
    this.assignatureList = []
    this.currentBadges = []
  }

  ngOnInit(): void {
    this.panelService.getTableList("logros").subscribe(
      response => {this.currentBadges = response},
      error => {console.log(error)}
    )
  }

  unlockSelector(selection:string):void {
    this.disableAssignature = false
    this.panelService.getOptionList("dep_grados_materia", selection).subscribe(
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

  addBadge():void {
    console.log(this.badgesForm)
    // this.panelService.insertBadge(this.badgesForm).subscribe(
    //   success => {
    //     console.log(success)
    //     this.notifier.open("Agregado", "OK", {duration: 3*1000})
    //     this.panelService.getTableList("logros").subscribe(
    //       response => {
    //         this.currentBadges = response
    //         this.badgesTable.renderRows()
    //       },
    //       error => {console.warn(error)}
    //     )
    //   },
    //   error => {
    //     this.notifier.open("Error", "OK", {duration: 3*1000})
    //     console.warn(error)
    //   }
    // )
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
    this.panelService.updateBadgeData(badgeData).subscribe(
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
    console.log(selected)
    this.panelService.deleteBadge(selected).subscribe(
      success => {
        this.notifier.open("Eliminado", "OK", {duration: 3*1000})
        // this.currentBadges.pop()
        // this.badgesTable.renderRows()
      },
      error => {
        this.notifier.open("Error", "OK", {duration: 3*1000})
        console.warn(error)
      }
    )
  }

}