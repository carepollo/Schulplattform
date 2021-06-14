import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

import { User } from '../models/User';
import { Person } from '../models/Person';
import { Auth } from '../models/Auth';
import { SelectOption } from '../models/SelectOption';
import { BadgesTable } from '../models/BadgeTable';
import { Observation } from "../models/Observation";

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AcademicService {


  public backend:string = environment.api_url
  public frontend:string = environment.app_url
  public userdata:User = {}
  public authenticate:Auth = {}
  public token:any = ""



  constructor(private http: HttpClient) { }


  //obtener datos recurrentes como tablas o selectores específicos
  getOptionList(tabletarget:string | number, filter:any): Observable<Array<SelectOption>> {
    let request = {
      tablename: tabletarget,
      selectId: filter
    }
    return this.http.post<Array<SelectOption>>(`${this.backend}/panel/userprofile/selector`, request)
  }
  getTable(identity:string, requestData:any):Observable<any>{
    let rData = {
      target: identity,
      data: requestData
    }
    return this.http.post(`${this.backend}/academic/grades/get`, rData)
  }

  //crud de observaciones
  getObservers(group:number): Observable<any> {
    return this.http.get<any>(`${this.backend}/academic/observations/get/many/${group}`)
  }
  getObservations(student:number): Observable<Array<Observation>> {
    return this.http.get<any>(`${this.backend}/academic/observations/get/single/${student}`)
  }


  //crud de notas
  updateGrade(data:any): Observable<boolean>{
    return this.http.post<boolean>(`${this.backend}/academic/grades/update`, data)
  }
  
  //crud de logros
  getBadgesTable(tablename:string): Observable<Array<any>> {
    return this.http.get<Array<any>>(`${this.backend}/academic/badges/${tablename}`)
  }
  updateBadgeData(badge:BadgesTable): Observable<boolean> {
    return this.http.post<boolean>(`${this.backend}/academic/badges/update`, badge)
  }
  deleteBadge(badge:number): Observable<boolean> {
    return this.http.get<boolean>(`${this.backend}/academic/badges/delete/${badge}`)
  }

  insertBadge(data:BadgesTable): Observable<boolean> {
    return this.http.post<boolean>(`${this.backend}/academic/badges/insert`, data)
  }


}
