import {json, query, Request, Response} from 'express';
import link_db from '../connection';
import Utilities from '../Utilities';

class ReportsController {

    public async getReport(request:Request, response: Response) {
        try {
            let currentYear:number = new Date().getFullYear()
            let query:string = ""
            let resultData = {}

            if (currentYear == request.body.parameter) {
                // const data = await link_db.query(query)
            }
            else {
                // const data = await link_db.query(query)
            }

            response.json({
                status: 200,
                message: "true"
            })
        }
        catch (error) {
            console.log(error)
            response.json({
                status: 500,
                message: "Ha habido un error generando el archivo"
            })
        }
    }

    //para la tabla de reporte total de estudiantes
    public async getFullTable(request:Request, response: Response): Promise <void | null> {
        try {
            let currentYear:number = new Date().getFullYear()
            let query:string = ""
            var resultData:any = []

            //si es reporte del año en curso
            if (currentYear == request.body.parameter) {
                query = `SELECT notas.estudiante_corresponde AS studentId, CONCAT(personas.nombres_persona, " ", personas.apellidos_persona) AS fullname , materias.materia_grado as assignature , nota_p1 AS g1, nota_p2 AS g2, nota_p3 AS g3, nota_p4 AS g4, nota_final AS gf FROM notas
                            INNER JOIN personas ON notas.estudiante_corresponde = personas.id_persona
                            INNER JOIN dep_grados_materia AS materias ON notas.materia_corresponde = materias.id
                            WHERE estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.target}) and periodo_corresponde = NOW() ORDER BY materias.materia_grado ASC
                `
                const data = await link_db.query(query)
                if (data.length < 1) {
                    response.json({
                        status: 500,
                        message: "No se encontraron registros"
                    })
                    return null
                }

                // formar objeto para tabla en cliente
                for (let i = 0; i < data.length; i++) {
                    let row:any = data[i]
                    let index = {
                        "id": row["studentId"],
                        "name": row["fullname"],
                        "data": [0],
                        "total": 0
                    }
                    let l = 0
                    index.data = []

                    for (let j = 0; j < data.length; j++) {
                        if (data[j]["studentId"] == index.id) {
                            let content = data[j]
                            delete content["studentId"]
                            delete content["fullname"]
                            index.data.push(content)
                            index.total += content["gf"]
                            l++
                        }
                    }
                    if (index.id !== undefined) {
                        index.total = index.total / l
                        resultData.push(index)
                    }
                }
            }
            else {
                //si es reporte de un año pasado
                query = "SELECT * FROM boletin"
                const data = await link_db.query(query)
                
                if (data.length < 1) {
                    response.json({
                        status: 500,
                        message: "No se encontraron registros"
                    })
                    return null
                }

            }
            
            response.json({
                status:200,
                message: resultData
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

    //para los gráficos de rendimiento
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
                assignatures = Utilities.removeDuplicates(assignatures)

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