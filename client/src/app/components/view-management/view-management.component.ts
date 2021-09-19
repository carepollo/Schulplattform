import { Component, OnInit, Input } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

import { AcademicService } from 'src/app/services/academic.service';
import { SelectOption } from "src/app/models/SelectOption";
import { User } from 'src/app/models/User';
import { Person } from 'src/app/models/Person';

@Component({
  selector: 'app-view-management',
  templateUrl: './view-management.component.html',
  styleUrls: ['./view-management.component.css']
})
export class ViewManagementComponent implements OnInit {

  @Input() userdata: User = {}


  constructor() { }

  ngOnInit(): void {
  }

}
