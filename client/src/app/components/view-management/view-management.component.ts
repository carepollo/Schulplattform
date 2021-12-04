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
    this.managementService.listPersons().subscribe(
      response => {this.currentUsers = response},
      error => {this.notifier.open("Error", "Aceptar")}
    )
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

  //actualizar lista de municipios
  getCity(target:number, origin:string):void {
    this.panelService.getOptionList("municipios", target).subscribe(
      response => {
        if (origin == "zone_expedition") {
          this.personFormData[5].options = response
        }
        else if (origin == "zone_lives") {
          this.personFormData[11].options = response
        }
      },
      error => {
        console.warn(error);
        this.notifier.open("Error al traer los datos", "Aceptar");
      }
    )
  }

  //obtener los datos de una sola persona y usuario en caso de tenerlo
  getUser(id:number) {
    this.managementService.getPersonData(id).subscribe(
      response => {
        this.setUpUser = response.message;
        console.log(this.setUpUser);
      },
      error => {this.notifier.open("Error", "Aceptar")}
    )
  }

  //salvar en base de datos los campos del formulario, sirve para actualizar y crear
  postUser():void {
    console.log(JSON.stringify(this.setUpUser));
    this.managementService.saveUserData(this.setUpUser).subscribe(
      success =>{
        console.log(success);
        this.notifier.open(success.message, "Atención", {duration:3000})
      },
      error => {
        console.log(error)
      }
    );
    this.cleanUserForm();
  }

  //vaciar los campos del formulario
  cleanUserForm():void {
    this.setUpUser = {
      id:0,
      username: "",
      password: "",
      type: "",
      person: {}
    }
  }
}
