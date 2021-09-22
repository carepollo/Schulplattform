import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


import { PanelService } from 'src/app/services/panel.service'
import { AcademicService } from 'src/app/services/academic.service';
import { ManagementService } from "src/app/services/management.service";

import { SelectOption } from "src/app/models/SelectOption";
import { User } from 'src/app/models/User';
import { Person } from 'src/app/models/Person';
import { FormInput } from 'src/app/models/FormInput';
import { formInputs } from './inputsTemplate'

@Component({
  selector: 'app-view-management',
  templateUrl: './view-management.component.html',
  styleUrls: ['./view-management.component.css']
})
export class ViewManagementComponent implements OnInit, AfterViewInit {

  @Input() userdata: User = {}

  @ViewChild(MatPaginator) paginator!: MatPaginator
  
  currentUsers:any[] = []
  setUpUser:any = {  
    username: "",
    password: "",
    type: "",
    person: {}
  }

  displayColumns: string[] = ["ID", "Nombre Completo", "Tipo", "Acciones"]
  usersTable = new MatTableDataSource<any>(this.currentUsers)
  userFormData:FormInput[] = formInputs.user
  personFormData:FormInput[] = formInputs.person
  
  constructor(
    private panelService:PanelService,
    private academicService:AcademicService,
    private managementService:ManagementService,
    private notifier:MatSnackBar
  ) { }

  ngOnInit(): void {
    this.panelService.getOptionList('departamentos', 0).subscribe(
      response => {
        this.personFormData[4].options = response
        this.personFormData[10].options = response
      },
      error => {console.warn(error)}
    )
  }
  
  ngAfterViewInit():void {
    this.usersTable.paginator = this.paginator;
  }

  //para asignar los valores de los campos a su propiedad correspondiente del objeto
  assignValue(input:any, property:string | undefined, fatherProperty:string = ""):void {
    if (property != undefined) {
      try {
        if (fatherProperty != "") {
          this.setUpUser[fatherProperty][property] = input.target.value
        }
        else {
          this.setUpUser[property] = input.target.value
        }        
      }
      catch(error) {
        if (fatherProperty != "") {
          this.setUpUser[fatherProperty][property] = input.value
        }
        else {
          this.setUpUser[property] = input.value
        }        
      }
    }
  }

  //salvar en base de datos los campos del formulario, sirve para actualizar y crear
  postUser(method:string):void {
    if (method == "update") {
      this.managementService.saveUserData()
    }
    else {
      this.managementService.updateUserData()
    }
  }

  //vaciar los campos del formulario
  cleanUserForm():void {
    console.log(this.setUpUser)
  }
}
