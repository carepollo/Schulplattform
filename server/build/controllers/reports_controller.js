"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportsController = void 0;
const connection_1 = __importDefault(require("../connection"));
const Utilities_1 = __importDefault(require("../Utilities"));
class ReportsController {
    getReport(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //trae los datos para crear un JSON que creará el pdf en cliente
                let currentYear = new Date().getFullYear();
                let resultData = [];
                //si se quiere reporte del periodo actual u otro año
                if (currentYear == request.body.period) {
                    let targets = [];
                    if (request.body.person !== "*") {
                        targets[0] = request.body.person;
                    }
                    else {
                        let groupMembers = yield connection_1.default.query(`SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.group}`);
                        groupMembers = groupMembers.map((x) => x["persona"]);
                        targets = groupMembers;
                    }
                    for (let i = 0; i < targets.length; i++) {
                        const aPerson = targets[i];
                        let person = yield connection_1.default.query(`SELECT * FROM personas WHERE id_persona = ${aPerson}`);
                        let finalGrade = yield connection_1.default.query(`SELECT AVG(nota_final) AS globalGrade FROM notas WHERE estudiante_corresponde = ${aPerson} AND periodo_corresponde = ${currentYear}`);
                        let observations = yield connection_1.default.query(`SELECT descripcion FROM observaciones WHERE sujeto_destinatario = ${aPerson} AND YEAR(fecha) = ${currentYear}`);
                        let grade = yield connection_1.default.query(`SELECT (SELECT grado FROM grupos WHERE id = groups.grupo_corresponde) AS groupName FROM dep_grupos_persona AS groups WHERE persona = ${aPerson}`);
                        person = person[0];
                        finalGrade = finalGrade[0]["globalGrade"];
                        observations = observations.map((x) => x = x["descripcion"]);
                        grade = grade[0]["groupName"];
                        let eachData = {
                            "site": person["sede"],
                            "schedule": person["jornada"],
                            "grade": grade,
                            "period": currentYear,
                            "studentId": aPerson,
                            "studentFullname": `${person["nombres_persona"]} ${person["apellidos_persona"]}`,
                            "assignatures": yield connection_1.default.query(`SELECT 
                            (SELECT materia_grado FROM dep_grados_materia WHERE id = notas.materia_corresponde) AS assignatureName,
                            (SELECT CONCAT(nombres_persona, " ", apellidos_persona) FROM personas WHERE id_persona = notas.dictado_por) AS teacherName,
                            (SELECT descripcion FROM logros WHERE id = notas.logro) as conclusion,
                            nota_p1 as g1, nota_p2 as g2, nota_p3 as g3, nota_p4 as g4, nota_final as gf,
                            CASE
                                WHEN nota_final > 4.5 THEN "Superior"
                                WHEN nota_final >= 4.0 THEN "Alto"
                                WHEN nota_final >= 3.0 THEN "Básico"
                                ELSE "Bajo"
                            END AS gradeResult
                            FROM notas WHERE estudiante_corresponde = ${aPerson} AND periodo_corresponde = ${currentYear}`),
                            "observations": observations,
                            "finalGrade": finalGrade,
                            "finalResult": Utilities_1.default.getPerformance(finalGrade),
                            "approval": (finalGrade > 3.0) ? "Aprobado" : "Reprobado"
                        };
                        resultData.push(eachData);
                    }
                }
                else {
                    let targets = [];
                    if (request.body.person !== "*") {
                        targets[0] = request.body.person;
                    }
                    else {
                        let groupMembers = yield connection_1.default.query(`SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.group}`);
                        groupMembers = groupMembers.map((x) => x["persona"]);
                        targets = groupMembers;
                    }
                    for (let i = 0; i < targets.length; i++) {
                        const person = yield connection_1.default.query(`SELECT * FROM boletin WHERE estudiante_identificacion = ${targets[i]} AND periodo = ${request.body.period}`);
                        if (person.length < 1) {
                            continue;
                        }
                        let observations = yield connection_1.default.query(`SELECT descripcion FROM observaciones WHERE sujeto_destinatario = ${targets[i]} AND YEAR(fecha) = ${request.body.period}`);
                        observations = observations.map((x) => x = x["descripcion"]);
                        let eachData = {
                            "site": person["sede"],
                            "schedule": person["jornada"],
                            "grade": person["grado"],
                            "period": person["periodo"],
                            "studentId": person["estudiante_identificacion"],
                            "studentFullname": person["estudiante_nombre"],
                            "assignatures": yield connection_1.default.query(`SELECT 
                            (SELECT materia_grado FROM dep_grados_materia WHERE id = notas.materia_corresponde) AS assignatureName,
                            (SELECT CONCAT(nombres_persona, " ", apellidos_persona) FROM personas WHERE id_persona = notas.dictado_por) AS teacherName,
                            (SELECT descripcion FROM logros WHERE id = notas.logro) as conclusion,
                            nota_p1 as g1, nota_p2 as g2, nota_p3 as g3, nota_p4 as g4, nota_final as gf,
                            CASE
                                WHEN nota_final > 4.5 THEN "Superior"
                                WHEN nota_final >= 4.0 THEN "Alto"
                                WHEN nota_final >= 3.0 THEN "Básico"
                                ELSE "Bajo"
                            END AS gradeResult
                            FROM notas WHERE estudiante_corresponde = ${targets[i]} AND periodo_corresponde = ${request.body.period}`),
                            "observations": observations,
                            "finalGrade": person["global_nota"],
                            "finalResult": person["global_desempeno"],
                            "approval": person["aprobacion"]
                        };
                        resultData.push(eachData);
                    }
                }
                if (resultData.length > 0) {
                    response.json({
                        status: 200,
                        message: resultData
                    });
                }
                else {
                    response.json({
                        status: 500,
                        message: "No se encontraron registros"
                    });
                }
            }
            catch (error) {
                console.log(error);
                response.json({
                    status: 500,
                    message: "Ha habido un error generando el archivo"
                });
            }
        });
    }
    //para la tabla de reporte total de estudiantes
    getFullTable(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var resultData = [];
                let query = `SELECT notas.estudiante_corresponde AS studentId, CONCAT(personas.nombres_persona, " ", personas.apellidos_persona) AS fullname , materias.materia_grado as assignature , nota_p1 AS g1, nota_p2 AS g2, nota_p3 AS g3, nota_p4 AS g4, nota_final AS gf FROM notas
                INNER JOIN personas ON notas.estudiante_corresponde = personas.id_persona
                INNER JOIN dep_grados_materia AS materias ON notas.materia_corresponde = materias.id
                WHERE personas.tipo = "Estudiante" AND estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.target}) AND periodo_corresponde = ${request.body.parameter} ORDER BY materias.materia_grado ASC
            `;
                const data = yield connection_1.default.query(query);
                if (data.length == 0) {
                    response.json({
                        status: 500,
                        message: "No se encontraron registros"
                    });
                    return null;
                }
                // formar objeto para tabla en cliente
                for (let i = 0; i < data.length; i++) {
                    let row = data[i];
                    let index = {
                        "id": row["studentId"],
                        "name": row["fullname"],
                        "data": [0],
                        "total": 0
                    };
                    let l = 0;
                    index.data = [];
                    for (let j = 0; j < data.length; j++) {
                        if (data[j]["studentId"] == index.id) {
                            let content = data[j];
                            delete content["studentId"];
                            delete content["fullname"];
                            index.data.push(content);
                            index.total += content["gf"];
                            l++;
                        }
                    }
                    if (index.id !== undefined) {
                        index.total = index.total / l;
                        resultData.push(index);
                    }
                }
                response.json({
                    status: 200,
                    message: resultData
                });
            }
            catch (error) {
                console.log(error);
                response.json({
                    status: 500,
                    message: "Ha habido un error trayendo la tabla"
                });
            }
        });
    }
    //para los gráficos de rendimiento
    getGraphs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield connection_1.default.query(`SELECT materia_corresponde, (SELECT materia_grado FROM dep_grados_materia WHERE dep_grados_materia.id = notas.materia_corresponde) AS materia, nota_p1, nota_p2, nota_p3, nota_p4, nota_final  FROM notas WHERE periodo_corresponde = ${request.body.parameter} AND estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${request.body.target}) ORDER BY materia_corresponde ASC`);
                if (data.length > 0) {
                    var resultData = [];
                    var assignatures = [];
                    //obteniendo lista de materias
                    for (let i = 0; i < data.length; i++) {
                        assignatures.push(Object.values(data[i])[0]);
                    }
                    assignatures = Utilities_1.default.removeDuplicates(assignatures);
                    let i = 0;
                    let matrices = [];
                    //formando objeto, únicamente estructura, faltandole las notas
                    while (i < assignatures.length) {
                        resultData[i] = {};
                        let matrix = [];
                        for (let j = 0; j < data.length; j++) {
                            let row = Object.values(data[j]);
                            if (row[0] == assignatures[i]) {
                                resultData[i].name = row[1];
                                resultData[i].data = [];
                                for (let l = 0; l < 5; l++) {
                                    let period = (l == 4) ? "Final" : l + 1;
                                    resultData[i].data[l] = {
                                        "label": `Periodo ${period}`
                                    };
                                }
                                matrix.push(row.slice(2, row.length));
                            }
                        }
                        matrices.push(matrix);
                        i++;
                    }
                    //leyendo matriz de notas para hacer conteos
                    for (let i = 0; i < resultData.length; i++) {
                        let eachAssignature = matrices[i];
                        let l = 0;
                        while (l < 5) {
                            let counter = [0, 0, 0, 0];
                            for (const grades of eachAssignature) {
                                if (grades[l] > 4.5) {
                                    counter[3] += 1;
                                }
                                else if (grades[l] >= 4.0) {
                                    counter[2] += 1;
                                }
                                else if (grades[l] >= 3.0) {
                                    counter[1] += 1;
                                }
                                else {
                                    counter[0] += 1;
                                }
                            }
                            resultData[i].data[l].counts = counter;
                            l++;
                        }
                    }
                    response.json({
                        status: 200,
                        message: resultData
                    });
                }
                else {
                    response.json({
                        status: 500,
                        message: "No se encontraron registros"
                    });
                }
            }
            catch (error) {
                console.log(error);
                response.json({
                    status: 500,
                    message: "Error trayendo los gráficos"
                });
            }
        });
    }
}
exports.reportsController = new ReportsController();
