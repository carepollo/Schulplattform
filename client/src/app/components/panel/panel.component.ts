import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from "@angular/router";
import { Observable } from 'rxjs';

import { PanelService } from '../../services/panel.service';
import { Auth } from '../../models/Auth';
import { User } from '../../models/User';
import { PanelOption } from '../../models/PanelOption';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.css'],
  providers: []
})
export class PanelComponent implements OnInit, OnChanges {

  appname: string
  userlogged: User
  panelOptions: Array<PanelOption>
  currentView:string
  keytoken:any = ""

  constructor(private panelService: PanelService, private router:Router) {
    this.keytoken = localStorage.getItem("SchoolToken")
    this.currentView = "profile"
    this.appname = "Schulplattform"
    this.panelOptions =  [
      {icon: "inventory 2", content: "Académico", componentName: "academic"},
      {icon: "create", content: "Plataforma Gero", componentName: "platform"},
      {icon: "grading", content: "Descargar Carnet", componentName: "downloadIdCard"},
      {icon: "leaderboard", content: "Reportes", componentName: "reports"},
      {icon: "rule", content: "Votaciones", componentName: "elections"}
    ]
    this.userlogged = {
      id: 0,
      username: "",
      password: "",
      type: "",
      picture: "",
      person: {
        zone_expedition: {value: 0},
        city_expedition: {value: 0},
        zone_lives: {value: 0},
        city_lives: {value: 0}
      },
    }
    this.currentView = "profile"
  }

  ngOnInit(): void {
    this.getUserData(this.keytoken)

    //ATENCIÓN, CONDICIONAL INVERTIDO DURANTE DESARROLLO PARA LOS PERMISOS
    if(this.userlogged.type != "Coordinador") {
      this.panelOptions.push(
        {
          icon: "dashboard",
          content: "Administración",
          componentName: "management"
        }
      )
    }
  }
  ngOnChanges():void {
  }

  //obtener los datos del usuario que se logea y comprobar si esta logeado o no
  getUserData(received:string): void {
    if (received == null) {
      alert("no esta logeado")
      this.router.navigate(["login"])
    }
    else {
      this.panelService.loadPanel(received).subscribe(
        (response) => {
          this.userlogged = response
        },
        error => {
          console.warn(error)
        }
      );  
    }
  }

  //para cerrar sesión y eliminar el token
  escapeSystem():void {
    localStorage.removeItem("SchoolToken")
    this.router.navigate(["login"])
  }

  //para cambiar de vista (componente) o hacer una acción dependiendo del caso
  changeView(component:string):void {
    switch (component) {
      case "platform":
        window.open("http://www.w3schools.com", "_blank")
        break;
      case "downloadIdCard":
        this.getIdCard("descargando carnet de usuario")
        break;
      default:
        this.currentView = component
        break;
    }
  }

  //función que solicitará al backend y descargará un pdf con el carnet de usuario
  getIdCard(userId:any):any {
    console.log(userId)
    return userId
  }
}