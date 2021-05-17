import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';

import { LoginService } from '../../services/login.service';
import { PanelService } from "src/app/services/panel.service";
import { User } from 'src/app/models/User';
import { Auth } from 'src/app/models/Auth';

import { environment } from "src/environments/environment";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  public user:Auth = {
    auth: false,
    token: ""
  }
  public sentData:User = {
    username: "",
    password: ""
  }
  public visible:boolean = true

  constructor(private loginService:LoginService, private router:Router, private notifier: MatSnackBar) { }

  ngOnInit(): void {
    document.addEventListener("keydown", e => {
      if (e.key == "Enter") {
        this.notifier.open("Logeando", "", {duration: 1*1000})
        this.tryLogin(this.sentData)
      }
    })
  }
  ngOnDestroy(): void {
  }
  
  //comprobar si el usuario logeado existe y logearlo
  tryLogin(provided: User) {
    this.loginService.login(provided).subscribe(
      response => {
        this.prepareLogin(response)
      },
      error => {
        this.notifier.open("Error del Sistema", "", {duration: 4*1000});
        console.log(error)
      }
    )
  }

  //creación del token
  prepareLogin(received: Auth): void{
    let verified:any = received
    if(verified.auth) {
      this.user = verified
      localStorage.setItem("SchoolToken", verified.token)
      this.router.navigate(["panel"])
    }
    else {
      this.notifier.open("Datos Incorrectos", "Cerrar", {duration: 4*1000});
    }
  }

}
