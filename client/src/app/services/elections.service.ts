import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElectionsService {

  private backend:string = environment.api_url
  private frontend:string = environment.app_url

  constructor(private http: HttpClient) { }

  getSurveys():Observable<any> {
    return this.http.get(`${this.backend}/elections/getAllElections`)
  }
  postSurvey(datasource:any):Observable<any> {
    return this.http.post(`${this.backend}/elections/postElection`, datasource)
  }
}
