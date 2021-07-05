import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-view-elections',
  templateUrl: './view-elections.component.html',
  styleUrls: ['./view-elections.component.css']
})
export class ViewElectionsComponent implements OnInit {

  @Input() userdata: User = {}

  constructor() { }

  ngOnInit(): void {
  }

}
