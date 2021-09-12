import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from 'src/app/models/User';
import { Survey } from 'src/app/models/Survey';

import { ElectionsService } from 'src/app/services/elections.service';
import * as moment from 'moment';

@Component({
  selector: 'app-view-elections',
  templateUrl: './view-elections.component.html',
  styleUrls: ['./view-elections.component.css']
})
export class ViewElectionsComponent implements OnInit {

  @Input() userdata: User = {}
  public allSurveys:Survey[] = []
  public currentSurvey:Survey = {
    title: "",
    dateStart: moment(new Date()).format("YYYY-MM-DD"),
    dateEnd: "",
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
    this.electionsService.getSurveys().subscribe(
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

  addOption():void {
    this.currentSurvey.options.push({name: ""})
  }

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

  createSurvey():boolean {
    this.currentSurvey.dateEnd = moment(this.currentSurvey.dateEnd).format("YYYY-MM-DD")

    if (this.currentSurvey.title == "") {
      this.notifier.open("La encuesta debe tener un título", "Aceptar")
      return false
    }
    else if(this.currentSurvey.dateEnd == "") {
      this.notifier.open("La encuesta debe tener una fecha de finalización")
      return false
    }
    else {
      for (let i = 0; i < this.currentSurvey.options.length; i++) {
        const element = this.currentSurvey.options[i];
        if (element.name == "") {
          this.notifier.open("Las opciones deben tener un valor", "Aceptar")
          return false
        }
      }

      this.electionsService.postSurvey(this.currentSurvey).subscribe(
        success => {
          if (success.status == 200) {
            this.electionsService.getSurveys().subscribe(
              success => {this.allSurveys = success.message}
            )
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

}
