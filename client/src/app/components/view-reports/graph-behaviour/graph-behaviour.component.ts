import { Component, OnInit, Input, OnDestroy, DoCheck } from '@angular/core';
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
export class GraphBehaviourComponent implements OnInit, OnDestroy, DoCheck {

  @Input() dataSource:any = {}

  charts:GraphBehaviour[] = []
  printed:boolean = false

  constructor(private reportsService: ReportsService, public notifier: MatSnackBar) { }

  ngOnInit(): void | null {
    for (const prop in this.dataSource) {
      if(this.dataSource[prop] == 0 || this.dataSource[prop] == "") {
        this.notifier.open("Debe todos los campos ingresados", "OK", {duration: 3*1000})
        return null
      }
    }
    
    this.dataSource.parameter = parseInt(this.dataSource.parameter)
    this.reportsService.getReport(this.dataSource).subscribe(
      success => {
        if (success.status == 200 && success.message.length > 0) {
          this.dataSource.data = success.message
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

  ngDoCheck():void {
    if (this.dataSource.data != undefined) {
      this.print()
    }
    this.printed = false

  }
  
  ngOnDestroy(): void {
    console.log("destroyed")
    // this.charts.forEach(elmnt => {
    //   elmnt.chart.destroy()
    // })
  }

  print():void {
    this.printed = true

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
          },
          scales: {
            y: {
              display: false
            }
          }
        }
      }

      this.charts.push({
        id: graphId,
        chart: config
      })
    }

    for (let i = 0; i < this.charts.length; i++) {
      let ctx = <HTMLCanvasElement>document.getElementById(this.charts[i].id)
      if (ctx != null) {
        let canva:any = ctx.getContext("2d")
          this.charts[i].chart = new Chart(canva, this.charts[i].chart)
        }
      }
  }

}
