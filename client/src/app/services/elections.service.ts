import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";
import { Observable } from 'rxjs';
import { ObserversModule } from '@angular/cdk/observers';

@Injectable({
  providedIn: 'root'
})
export class ElectionsService {

  private backend:string = environment.api_url
  private frontend:string = environment.app_url
  private mainLocation:string = this.backend + "/elections"

  constructor(private http: HttpClient) { }

  getSurveys(votant:number):Observable<any> {
    return this.http.get(`${this.mainLocation}/getAllElections/${votant}`)
  }
  postSurvey(datasource:any):Observable<any> {
    return this.http.post(`${this.mainLocation}/postElection`, datasource)
  }
  postVote(datasource:any):Observable<any> {
    return this.http.post(`${this.mainLocation}/vote`, datasource)
  }
}
