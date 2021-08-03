import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

import { User } from '../models/User';
import { SelectOption } from '../models/SelectOption';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private backend:string = environment.api_url
  private frontend:string = environment.app_url

  constructor(private http: HttpClient) { }

  getReport(params:any): Observable<any>{
    let url = ""
    switch (params.method) {
      case "gradesTable":
        url = ""
        break
      case "graphBehaviour":
        url = "graphs"
        break
      case "studentsList":
        url = "list"
        break
    }
    return this.http.post(`${this.backend}/reports/${url}`, params)
  }
}
