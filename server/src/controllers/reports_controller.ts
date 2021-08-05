import {json, Request, Response} from 'express';
import link_db from '../connection';
import Utilities from '../Utilities';

class ReportsController {

    public async getFullTable(request:Request, response: Response) {
        try {
            let currentYear = new Date().getFullYear()
            if (currentYear != request.body.parameter) {
                // const data = await link_db.query(``)
            }
            else {
                const data = await link_db.query(``)
            }
            response.json({
                stauts:200,
                message: "working"
            })
        }
        catch (error) {
            console.log(error)
            response.json({
                status: 500,
                message: "Ha habido un error trayendo la tabla"
            })
        }
    }

    public async getList(request:Request, response: Response) {
        try {
            // const data = await link_db.query(``)
            response.json({
                status: 200,
                mesage: "sis"
            })
        }
        catch (error) {
            console.log(error)
            response.json({
                status: 500,
                message: "Ha habido un error trayendo la tabla"
            })
        }
    }

    public async getGraphs(request:Request, response:Response) {
        try {
            const data = await link_db.query(`SELECT materia_corresponde, (SELECT materia_grado FROM dep_grados_materia WHERE dep_grados_materia.id = notas.materia_corresponde) AS materia, nota_p1, nota_p2, nota_p3, nota_p4, nota_final  FROM notas WHERE periodo_corresponde = ${request.body.parameter} AND estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.target}) ORDER BY materia_corresponde ASC`)

            if (data.length > 0) {
                var resultData:any = []
                var assignatures:any = []
            
                //obteniendo lista de materias
                for (let i = 0; i < data.length; i++) {
                    assignatures.push(Object.values(data[i])[0])
                }
                assignatures = new Utilities().removeDuplicates(assignatures)

                let i = 0
                let matrices = []
                
                //formando objeto, únicamente estructura, faltandole las notas
                while (i < assignatures.length) {
                    resultData[i] = {}
                    let matrix = []
                    
                    for (let j = 0; j < data.length; j++) {
                        let row:any = Object.values(data[j])

                        if (row[0] == assignatures[i]) {
                            resultData[i].name = row[1]
                            resultData[i].data = []
                            for (let l = 0; l < 5; l++) {
                                let period = (l == 4) ? "Final" : l + 1
                                resultData[i].data[l] = {
                                    "label": `Periodo ${period}`
                                }                            
                            }
                            matrix.push(row.slice(2, row.length))
                        }
                    }
                    matrices.push(matrix)
                    i++
                }

                //leyendo matriz de notas para hacer conteos
                for (let i = 0; i < resultData.length; i++) {
                    let eachAssignature = matrices[i]
                    let l = 0
                    while (l < 5) {
                        let counter = [0,0,0,0]
                        for (const grades of eachAssignature) {
                            if (grades[l] > 4.5) {
                                counter[3] += 1
                            }
                            else if (grades[l] >= 4.0) {
                                counter[2] += 1
                            }
                            else if (grades[l] >= 3.0) {
                                counter[1] += 1
                            }
                            else {
                                counter[0] += 1
                            }
                        }
                        resultData[i].data[l].counts = counter
                        l++
                    }
                }

                response.json({
                    status:200,
                    message: resultData
                })
            }
            else {
                response.json({
                    status:500,
                    message: "No se encontraron registros"
                })
            }
            
        }
        catch (error) {
            console.log(error);
            
            response.json({
                status:500,
                message: "Error trayendo los gráficos"
            })
        }
    }

}

export const reportsController = new ReportsController()