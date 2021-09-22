import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  private backend:string = environment.api_url
  private frontend:string = environment.app_url

  constructor(private http:HttpClient) { }

  listPersons():void {}

  getPersonData():void {}

  saveUserData():void {}

  updateUserData():void {}

}
