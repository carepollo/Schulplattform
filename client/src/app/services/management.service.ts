import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class ManagementService {

  private backend:string = environment.api_url
  private frontend:string = environment.app_url

  constructor(private http:HttpClient) { }

  listPersons():Observable<any> {
    return this.http.get(this.backend + "/management/getAllUsers")
  }

  getPersonData(person:number):Observable<any> {
    return this.http.get(this.backend + "/management/getUser/" + person)
  }

  saveUserData(data:User):Observable<any> {
    return this.http.post(this.backend + "/management/handlePerson/", data);
  }

}
