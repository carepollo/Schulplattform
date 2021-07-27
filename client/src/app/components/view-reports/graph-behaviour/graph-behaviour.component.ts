import { Component, OnInit, Input } from '@angular/core';

import * as Chart from "chart.js";

@Component({
  selector: 'graph-behaviour',
  templateUrl: './graph-behaviour.component.html',
  styleUrls: ['./graph-behaviour.component.css']
})
export class GraphBehaviourComponent implements OnInit {

  @Input() dataSource:any = {}

  constructor() { }

  ngOnInit(): void {
    console.log(this.dataSource)
  }

}
