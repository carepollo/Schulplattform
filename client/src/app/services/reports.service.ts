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

  //trae reporte según la petición
  getReport(params:any): Observable<any>{
    return this.http.post(`${this.backend}/reports/${params.method}`, params)
  }

  //trae los datos para pdf
  getPdfData(params:any): Observable<any> {
    return this.http.post(`${this.backend}/reports/getReport`, params)
  }

  //retorna el objeto para configuración pdf, utiliza el mismo objeto devuelto por el método anterior
  setPdfConfig(datasource:any):any {
    const content:any = []

    for (let i = 0; i < datasource.length; i++) {
      //cabeceras estáticas
      const element = datasource[i];
      content.push(
        {
          columns: [
            {
              text: "Aquí va una imagen",
              width: "auto"
            },
            {
              text: "Institución Educativa Departamental Tecnológico de Madrid",
              style: "header",
              with: "auto"
            }
          ]
        },
        {
          text: `Creado mediante acuerdo No.033 de Octubre 30 de 1996 Resolución de Reconocimiento No. 4657 de 21 de Noviembre de 2003, Resolucion No.006319 de Noviembre 17 de 2006, Resolucion No.0011778 de diciembre 28 de 2007 y Resolucion No.005850 del 10 de julio de 2009.`,
          style: "quote",
          margin: [0, 5, 0, 0]
        },
        {
          margin: [0, 20, 0, 0],
          table: {
            style: "regular",
            widths: ["auto", "auto", "auto", "auto", "auto"],
            body: [
              [
                [{text:"Sede\n",bold:true}, element.site],
                [{text:"Jornada\n",bold:true}, element.schedule],
                [{text:"Grupo\n",bold:true}, element.grade],
                [{text:"Año\n",bold:true}, element.period],
                [{text:"Alumno\n",bold:true}, element.studentFullname]
              ]
            ]
          }
        }
      )

      //enlistamiento de asignaturas por registro
      const assignaturesBody:any[] = [
        [
          {text:"Asignatura",bold:true},
          {text:"P1",bold:true},
          {text:"P2",bold:true},
          {text:"P3",bold:true},
          {text:"P4",bold:true},
          {text:"PF",bold:true},
          {text:"Desempeño",bold:true}
        ]
      ]
      for (let j = 0; j < element.assignatures.length; j++) {
        const row = element.assignatures[j];
        assignaturesBody.push(
          [
            {
              ul: [
                row.assignatureName,
                row.teacherName,
                row.conclusion
              ]
            },
            row["g1"],
            row["g2"],
            row["g3"],
            row["g4"],
            row["gf"],
            row["gradeResult"]
          ]
        )
      }

      //enlistamiento de observaciones por elemento de lista
      const observationsBody:any[] = []
      for (let j = 0; j < element.observations.length; j++) {
        const row = element.observations[j];
        observationsBody.push(row)
      }

      //contenido final estático
      content.push(
        {
          table: {
            widths:["*", "auto", "auto", "auto", "auto", "auto", "auto"],
            body: assignaturesBody
          }
        },
        {
          text:"Observaciones",
          margin: [0, 20, 0, 0],
        },
        {
          ul: observationsBody
        },
        {
          text: "Nivel de desempeño : De 10 a 29.99 ( Bj-Bajo ) , 30 a 39.99 ( Bs-Básico) , De 40 a 45.99 ( A-Alto ), De 46 a 50 (S-Superior). | P1:33% P2:33% P3:34% ",
          alignment: "center",
          style: "quote",
          margin: [0, 5, 0, 0]
        },
        {
          text: `Nota final: ${element.finalGrade}, Desempeño: ${element.finalResult}`,
          style: "regular",
          alignment: "center"
        },
        {
          text: `${element.approval}`,
          style: "subheader",
          alignment: "center"
        },
        {
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: "Firma Rector",
              style: "regular",
              bold: true,
              alignment: "center"
            },
            {
              text: "Firma Director de grupo",
              style: "regular",
              bold: true,
              alignment: "center"
            }
          ]
        },
        {
          margin: [0, 40, 0, 0],
          columns: [
            {
              text: "Nombre Rector",
              style: "regular",
              bold: true,
              alignment: "center"
            },
            {
              text: "Nombre Director de grupo",
              style: "regular",
              bold: true,
              alignment: "center"
            }
          ]
        }
      )
    }

    const config = {
      content: content,
      styles: {
        header: {
          fontSize: 15,
          bold:true
        },
        quote: {
          fontSize: 8,
          italics: true
        },
        regular: {
          fontSize: 11
        },
        subheader: {
          fontSize: 14,
          bold: true
        }
      }
    }
    
    return config
  }
}
