import {json, query, Request, Response} from 'express';
import link_db from '../connection';
import Utilities from '../Utilities';

class ReportsController {

    public async getReport(request:Request, response: Response) {
        try {
            //trae los datos para crear un JSON que creará el pdf en cliente
            let currentYear:number = new Date().getFullYear()
            let resultData:any = []

            //si se quiere reporte del periodo actual u otro año
            if (currentYear == request.body.period) {
                let targets:Array<number> = []
                if (request.body.person !== "*") {
                    targets[0] = request.body.person
                }
                else {
                    let groupMembers = await link_db.query(`SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.group}`)
                    groupMembers = groupMembers.map((x:any) => x["persona"])
                    targets = groupMembers
                }

                for (let i = 0; i < targets.length; i++) {
                    const aPerson = targets[i]

                    let person = await link_db.query(`SELECT * FROM personas WHERE id_persona = ${aPerson}`)
                    let finalGrade = await link_db.query(`SELECT AVG(nota_final) AS globalGrade FROM notas WHERE estudiante_corresponde = ${aPerson} AND periodo_corresponde = ${currentYear}`)
                    let observations = await link_db.query(`SELECT descripcion FROM observaciones WHERE sujeto_destinatario = ${aPerson} AND YEAR(fecha) = ${currentYear}`)
                    let grade = await link_db.query(`SELECT (SELECT grado FROM grupos WHERE id = groups.grupo_corresponde) AS groupName FROM dep_grupos_persona AS groups WHERE persona = ${aPerson}`)
    
                    person = person[0]
                    finalGrade = finalGrade[0]["globalGrade"]
                    observations = observations.map((x:any) => x = x["descripcion"])
                    grade = grade[0]["groupName"]
    
                    let eachData = {
                        "site": person["sede"],
                        "schedule": person["jornada"],
                        "grade": grade,
                        "period": currentYear,
                        "studentId": aPerson,
                        "studentFullname": `${person["nombres_persona"]} ${person["apellidos_persona"]}`,
                        "assignatures": await link_db.query(`SELECT 
                            (SELECT materia_grado FROM dep_grados_materia WHERE id = notas.materia_corresponde) AS assignatureName,
                            (SELECT CONCAT(nombres_persona, " ", apellidos_persona) FROM personas WHERE id_persona = notas.dictado_por) AS teacherName,
                            logro as conclusion,
                            nota_p1 as g1, nota_p2 as g2, nota_p3 as g3, nota_p4 as g4, nota_final as gf,
                            CASE
                                WHEN nota_final > 4.5 THEN "Superior"
                                WHEN nota_final >= 4.0 THEN "Alto"
                                WHEN nota_final >= 3.0 THEN "Básico"
                                ELSE "Bajo"
                            END AS gradeResult
                            FROM notas WHERE estudiante_corresponde = ${aPerson} AND periodo_corresponde = ${currentYear}`
                        ),
                        "observations": observations,
                        "finalGrade": finalGrade,
                        "finalResult": Utilities.getPerformance(finalGrade),
                        "approval": (finalGrade > 3.0) ? "Aprobado" : "Reprobado"
                    }

                    resultData.push(eachData)
                }
            }
            else {
                let targets:Array<number> = []
                if (request.body.person !== "*") {
                    targets[0] = request.body.person
                }
                else {
                    let groupMembers = await link_db.query(`SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.group}`)
                    groupMembers = groupMembers.map((x:any) => x["persona"])
                    targets = groupMembers
                }

                for (let i = 0; i < targets.length; i++) {
                    const person = await link_db.query(`SELECT * FROM boletin WHERE estudiante_identificacion = ${targets[i]} AND periodo = ${request.body.period}`)
                    if (person.length < 1) {
                        continue
                    }

                    let observations = await link_db.query(`SELECT descripcion FROM observaciones WHERE sujeto_destinatario = ${targets[i]} AND YEAR(fecha) = ${request.body.period}`)
                    observations = observations.map((x:any) => x = x["descripcion"])

                    let eachData = {
                        "site": person["sede"],
                        "schedule": person["jornada"],
                        "grade": person["grado"],
                        "period": person["periodo"],
                        "studentId": person["estudiante_identificacion"],
                        "studentFullname": person["estudiante_nombre"],
                        "assignatures": await link_db.query(`SELECT 
                            (SELECT materia_grado FROM dep_grados_materia WHERE id = notas.materia_corresponde) AS assignatureName,
                            (SELECT CONCAT(nombres_persona, " ", apellidos_persona) FROM personas WHERE id_persona = notas.dictado_por) AS teacherName,
                            logro as conclusion,
                            nota_p1 as g1, nota_p2 as g2, nota_p3 as g3, nota_p4 as g4, nota_final as gf,
                            CASE
                                WHEN nota_final > 4.5 THEN "Superior"
                                WHEN nota_final >= 4.0 THEN "Alto"
                                WHEN nota_final >= 3.0 THEN "Básico"
                                ELSE "Bajo"
                            END AS gradeResult
                            FROM notas WHERE estudiante_corresponde = ${targets[i]} AND periodo_corresponde = ${request.body.period}`
                        ),
                        "observations": observations,
                        "finalGrade": person["global_nota"],
                        "finalResult": person["global_desempeno"],
                        "approval": person["aprobacion"]
                    }

                    resultData.push(eachData)
                }
            }

            if (resultData.length > 0) {
                response.json({
                    status: 200,
                    message: resultData
                })                
            }
            else {
                response.json({
                    status: 500,
                    message: "No se encontraron registros"
                })
            }
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
            var resultData:any = []
            let query:string = `SELECT notas.estudiante_corresponde AS studentId, CONCAT(personas.nombres_persona, " ", personas.apellidos_persona) AS fullname , materias.materia_grado as assignature , nota_p1 AS g1, nota_p2 AS g2, nota_p3 AS g3, nota_p4 AS g4, nota_final AS gf FROM notas
                INNER JOIN personas ON notas.estudiante_corresponde = personas.id_persona
                INNER JOIN dep_grados_materia AS materias ON notas.materia_corresponde = materias.id
                WHERE personas.tipo = "Estudiante" AND estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.target}) AND periodo_corresponde = ${request.body.parameter} ORDER BY materias.materia_grado ASC
            `
            const data = await link_db.query(query)
            if (data.length == 0) {
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