import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from "src/environments/environment";

import { User } from 'src/app/models/User';
import { Auth } from '../models/Auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public backend:string = environment.api_url
  public frontend:string = environment.app_url
  public userdata: User

  constructor(private http: HttpClient) {
    this.userdata = {}
  }

  login(user: User): Observable<any> {
    var response = this.http.post<Auth>(this.backend, user)
    return response;
  }

}