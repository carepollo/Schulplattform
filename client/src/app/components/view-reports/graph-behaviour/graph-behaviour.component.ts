import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { NgControlStatus } from '@angular/forms';
import { MatSnackBar } from "@angular/material/snack-bar";

import { ReportsService } from 'src/app/services/reports.service';


import { Chart, ChartItem, registerables } from 'chart.js';
Chart.register(...registerables)

export interface GraphBehaviour {
  id: string;
  chart?: any;
}


@Component({
  selector: 'graph-behaviour',
  templateUrl: './graph-behaviour.component.html',
  styleUrls: ['./graph-behaviour.component.css']
})
export class GraphBehaviourComponent implements OnInit, DoCheck {

  @Input() dataSource:any = {}

  charts:GraphBehaviour[] = []
  printed:boolean = false

  constructor(
    private reportsService: ReportsService,
    public notifier: MatSnackBar
    ) { }

  ngOnInit(): void | null {
    let pass = this.checkValidity()
    if (pass) {
      this.dataSource.parameter = parseInt(this.dataSource.parameter)
      this.reportsService.getReport(this.dataSource).subscribe(
        success => {
          if (success.status == 200 && success.message.length > 0) {
            this.dataSource.data = success.message
            this.print()
          }
          else {
            this.notifier.open(success.message, "OK", {duration: 3*1000})
          }
        },
        error => {
          this.notifier.open("Error cargando los grupos", "OK", {duration: 3*1000})
          console.error(error)
        }
      )      
    }
    else {
      this.notifier.open("Debe todos los campos ingresados", "OK", {duration: 3*1000})
    }
    

  }

  ngDoCheck():void {
    if (this.charts.length > 0 && !(this.charts[0].chart instanceof Chart)) {
      for (let i = 0; i < this.charts.length; i++) {
        let ctx = <HTMLCanvasElement>document.getElementById(this.charts[i].id)
        if (ctx != null) {
          let canva:any = ctx.getContext("2d")
          this.charts[i].chart = new Chart(canva, this.charts[i].chart)
        }
      }
      
    }
  }

  checkValidity():boolean {
    for (const prop in this.dataSource) {
      if(this.dataSource[prop] == 0 || this.dataSource[prop] == "") {
        return false
      }
    }
    return true
  }

  print(): void {

    for (let i = 0; i < this.dataSource.data.length; i++) {
      const graphData = this.dataSource.data[i]
      let config: any = {}
      let datasets: any[] = []
      let graphId = "canvas" + i
      
      for (let j = 0; j < graphData.data.length; j++) {
        datasets.push({
          label: graphData.data[j].label,
          data: graphData.data[j].counts,
          backgroundColor: ["rgba(255, 0, 0, 0.5)", "rgba(255, 255, 0, 0.5)", "rgba(0, 98, 255, 0.5)", "rgba(13, 255, 0, 0.5)"],
          borderColor: ["rgba(255, 0, 0, 1)", "rgba(255, 255, 0, 1)", "rgba(0, 98, 255, 1)", "rgba(13, 255, 0, 1)"],
          borderWidth: 1
        })
      }

      config = {
        type: "bar",
        data: {
          labels: ["Bajo", "Básico", "Alto", "Superior"],
          datasets: datasets
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top"
            },
            title: {
              display: true,
              text: "Rendimiento: " + graphData.name
            }
          }
        }
      }

      this.charts.push({
        id: graphId,
        chart: config
      })
    }

    //El problema esta en que no se ha renderizado el canvas aún para cuando este codigo se ejecuta por tanto no hay target


  }

}
