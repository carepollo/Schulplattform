import { Component, OnInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from 'src/app/models/User';
import { Survey, SurveyOption } from 'src/app/models/Survey';

import { ElectionsService } from 'src/app/services/elections.service';
import * as moment from 'moment';
import { MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-view-elections',
  templateUrl: './view-elections.component.html',
  styleUrls: ['./view-elections.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class ViewElectionsComponent implements OnInit {

  @Input() userdata: User = {}
  public allSurveys:Survey[] = []
  public currentSurvey:Survey = {
    title: "",
    dateStart: new Date(),
    dateEnd: "",
    description: "",
    options: [{
      name: ""
    }]
  }

  public panelOpenState = false;
  
  constructor(
    public electionsService:ElectionsService,
    private notifier:MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.userdata.person.id_person != undefined) {
      this.listSurveys();
    }
  }
  
  //todo el proceso de traer del servidor todas las encuestas, usa el ID personal
  listSurveys():void {
    this.electionsService.getSurveys(this.userdata.person.id_person).subscribe(
      success => {
        if (success.status == 200) {
          this.allSurveys = success.message
        }
        else {
          console.log(success)
          this.notifier.open("Se produjo un error trayendo los datos", "OK", {duration:3000})
        }
      },
      error => {
        console.log(error)
        this.notifier.open("Se produjo un error trayendo los datos", "OK", {duration:3000})
      }
    )
  }

  //añadir una opción a la encuesta
  addOption():void {
    this.currentSurvey.options.push({name: ""})
  }

  //eliminar determinada opción de la encuesta
  removeOption(indicator:number):boolean {
    if (this.currentSurvey.options.length == 1) {
      this.notifier.open("Debe tener al menos una alternativa", "Aceptar")
      return false
    }
    else {
      this.currentSurvey.options.splice(indicator, 1)
      return true
    }    
  }

  //crear encuesta
  createSurvey():boolean {
    //asegurar que los formatos de fecha entren correctamente
    this.currentSurvey.dateStart = moment(this.currentSurvey.dateStart).format("YYYY-MM-DD")
    this.currentSurvey.dateEnd = moment(this.currentSurvey.dateEnd).format("YYYY-MM-DD")

    //validación de formulario
    if (new Date(this.currentSurvey.dateStart) >= new Date(this.currentSurvey.dateEnd)) {      
      this.notifier.open("La fecha de inicio debe ser inferior a la fecha de fin", "", {duration:4000})
      return false
    }
    else if(this.currentSurvey.title.length < 5) {
      this.notifier.open("La encuesta debe tener un título",  "", {duration:4000})
      return false
    }
    else {
      for (let i = 0; i < this.currentSurvey.options.length; i++) {
        const element = this.currentSurvey.options[i];
        if (element.name.length < 1) {
          this.notifier.open("Las opciones deben tener un valor",  "", {duration:4000})
          return false
        }
      }

      this.electionsService.postSurvey(this.currentSurvey).subscribe(
        success => {
          if (success.status == 200) {
            this.listSurveys()
          }
          else {
            this.notifier.open("Se produjo un error actualizando interfaz", "OK", {duration:3000})
          }
        },
        error => {
          console.log(error);
          this.notifier.open("Se produjo al salvar la encuesta", "OK", {duration:3000})
        }
      )
      return true
    }

  }

  //s es el índice de cuál encuesta afecta, o el índice de cuál opción voto
  //método para registrar un voto, donde se manda la petición se manda, pero la actualización de la vista se hace en cliente
  sendVote(s:number, o:number):void {
    const voteParams = {
      votant: this.userdata.person.id_person,
      election: this.allSurveys[s].id,
      option: this.allSurveys[s].options[o].id
    }
    this.electionsService.postVote(voteParams).subscribe(
      success => {
        this.listSurveys()
      },
      error => {
        console.log(error);
        this.notifier.open("No se pudo registrar su voto", "OK", {duration:3000});
      }
    )
    
  }

}
