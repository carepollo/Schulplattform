import { Component, Input, OnInit, ViewChild, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable } from '@angular/material/table'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcademicService } from "src/app/services/academic.service";
import { User } from 'src/app/models/User';
import { SelectOption } from "src/app/models/SelectOption";
import { BadgesTable } from "src/app/models/BadgeTable";
import { Observation } from "src/app/models/Observation";

export interface GradesTable {
  id: number;
  g1: number;
  g2: number;
  g3: number;
  g4: number;
  final: number;
  fullname: string;
  id_student: number;
}


@Component({
  selector: 'observations-form',
  templateUrl: './observationsForm.html',
  styleUrls: ['./view-academic.component.css']
})
export class ObservationsForm {

  public currDate:string = ""

  constructor(public dialogRef: MatDialogRef<ObservationsForm>, @Inject(MAT_DIALOG_DATA) public data: any) {
    let date = new Date()
    
    let day = date.getDate()
    let month = ((date.getMonth() + 1) < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1
    let year = date.getFullYear()

    this.currDate = `${year}-${month}-${day}`
  }

}

@Component({
  selector: 'app-view-academic',
  templateUrl: './view-academic.component.html',
  styleUrls: ['./view-academic.component.css']
})
export class ViewAcademicComponent implements OnInit {

  @Input() userdata: User
  @ViewChild(MatTable) badgesTable!: MatTable<any>

  gradesList:Array<SelectOption> = []
  judgeLevelList:Array<string> = ['Superior','Alto','Básico','Bajo']
  assignatureList:Array<SelectOption> = []
  badgesTitles:Array<string> = ["id","grade","level","assignature","description","actions"]
  currentBadges:Array<BadgesTable> = []
  disableAssignature:boolean = true
  disableAddBadge:boolean = true
  badgesForm:BadgesTable = {
    grade: "",
    assignature: "",
    level: "",
    description: ""
  }

  gradesForm = {
    grade: "",
    group: 0,
    scheme: "",
    place: "",
    assignature: ""
  }
  disableGradeGroup:boolean = true
  disableGradeAssignature:boolean = true
  disableGetGrades:boolean = true
  groupsList:Array<SelectOption> = []
  gradesAssignatureList:Array<SelectOption> = []
  gradesTitles:Array<string> = ["id_student", "fullname", "g1", "g2", "g3", "g4", "final", "actions"]
  gradesData:Array<GradesTable> = []
  modifiedGrade:GradesTable = {
    id: 0,
    g1: 0,
    g2: 0,
    g3: 0,
    g4: 0,
    final: 0,
    fullname: "",
    id_student: 0
  }

  observationsGroupList:Array<SelectOption> = []
  requestedGroup:number = 0
  groupMembersTitles:Array<string> = ["id_student", "fullname", "actions"]
  groupMembers:Array<any> = []
  groupsListMembers:Array<any> = []
  studentObserved:any
  observationsTitles:Array<string> = ["id_observation", "createdDate", "description", "author", "observed", "actions"]


  constructor(private academicService:AcademicService, private notifier:MatSnackBar, public dialogs:MatDialog) {
    this.userdata = {}
    this.studentObserved = {}
  }

  ngOnInit(): void {
    this.academicService.getOptionList("gradosTodo", "*").subscribe(
      response => {this.groupsList = response},
      error => {this.notifier.open("Error cargando los grados", "OK", {duration: 3*1000})}
    )
    this.academicService.getBadgesTable("logros").subscribe(
      response => {this.currentBadges = response},
      error => {
        this.notifier.open("Error cargando los logros", "OK", {duration: 3*1000})
        console.error(error)
      }
    )
    this.academicService.getOptionList("gruposTotal", "*").subscribe(
      response => {this.observationsGroupList = response},
      error => {
        this.notifier.open("Error cargando los grupos", "OK", {duration: 3*1000})
        console.error(error)
    }
    )
  }

  unlockSelector(selection:string|number, content:any, target?:string):void {
    this.academicService.getOptionList(selection, content).subscribe(
      response => {
        if (response.length < 1) {
          this.notifier.open("No se encontraron registros", "OK", {duration: 3*1000})
        }
        else {
          switch (selection) {
            case "dep_grados_materia":
              if(target == "badges") {
                this.disableAssignature = false
                this.assignatureList = response
              }
              else if(target == "grades") {
                this.disableGradeAssignature = false
                this.gradesAssignatureList = response
              }
              break;
            case "grupos":
              this.disableGradeGroup = false
              this.groupsList = response
              break;
          }
        }
      },
      error => {
        console.error(error)
        this.notifier.open("Error intentado traer registros", "OK", {duration: 3*1000})
      }
    )
  }

  unlockSend(form:any, target:string):void {
    let formFields:Array<any> = Object.values(form)
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
      switch (target) {
        case "badges":
          this.disableAddBadge = false
          break;
        case "grades":
          this.disableGetGrades = false
          break;      
      }
    }
  }

  insertBadge():void {
    this.academicService.insertBadge(this.badgesForm).subscribe(
      success => {
        this.notifier.open("Agregado", "OK", {duration: 3*1000})
        this.academicService.getBadgesTable("logros").subscribe(
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

  getAcademicTable(method:string, origin:any){
    this.academicService.getTable(method, origin).subscribe(
      success => {
        switch (method) {
          case "grades":
            this.gradesData = success
            console.log(this.gradesData)
            break;
          case "observations":
            break;
        }
      },
      error => {
        console.warn(error)
        this.notifier.open("Error", "OK", {duration: 3*1000})
      }
    )
  }

  setFinalGrade(data:any):void {
    let htmlData:any = document.getElementsByName(data)
    htmlData[6].value = (parseInt(htmlData[2].value) + parseInt(htmlData[3].value) + parseInt(htmlData[4].value) + parseInt(htmlData[5].value)) / 4
  }

  saveGrade(data:any):void {
    let htmlData:any = document.getElementsByName(data)
    this.modifiedGrade = {
      id_student: htmlData[0].value,
      fullname: htmlData[1].value,
      g1: htmlData[2].value,
      g2: htmlData[3].value,
      g3: htmlData[4].value,
      g4: htmlData[5].value,
      final: htmlData[6].value,
      id: htmlData[7].value,
    }
    this.academicService.updateGrade(this.modifiedGrade).subscribe(
      response => {
        this.notifier.open("Actualizado", "OK", {duration: 3*1000})
      },
      error => {
        this.notifier.open("Error", "OK", {duration: 3*1000})
        console.warn(error);
      }
    )
  }

  getGroupObservations(req:number):void {
    this.academicService.getObservers(req).subscribe(
      success => {
        this.groupMembers = success
      },
      error => {
        console.error(error)
      }
    )
  }

  showObservationsModal(observedData:any):void {
    let openable = true
    this.studentObserved = {
      id: observedData.id_student,
      fullname: observedData.fullname,
      labels: this.observationsTitles,
      author: this.userdata
    }
    this.academicService.getObservations(observedData.id_student).subscribe(
      response => {this.studentObserved.observations = response},
      error => {openable = false}
    )
    if(!openable) {
      this.notifier.open("Error en observaciones del estudiante", "OK", {duration: 3*1000})
    }
    else {
      const popupWindow = this.dialogs.open(ObservationsForm, {
        width: "80%",
        data: this.studentObserved
      })
    }
  }
}
