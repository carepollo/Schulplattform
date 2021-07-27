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
    getGraphs(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield connection_1.default.query(`SELECT materia_corresponde, (SELECT materia_grado FROM dep_grados_materia WHERE dep_grados_materia.id = notas.materia_corresponde) AS materia, nota_p1, nota_p2, nota_p3, nota_p4, nota_final  FROM notas WHERE periodo_corresponde = NOW();`);
                var resultData = [];
                var assignatures = [];
                //obteniendo lista de materias
                for (let i = 0; i < data.length; i++) {
                    assignatures.push(Object.values(data[i])[0]);
                }
                assignatures = new Utilities_1.default().removeDuplicates(assignatures);
                let i = 0;
                let matrices = [];
                //formando objeto, únicamente estructura, faltandole las notas
                while (i < assignatures.length) {
                    resultData[i] = {};
                    let matrix = [];
                    for (let j = 0; j < data.length; j++) {
                        let row = Object.values(data[j]);
                        //el problema radica en que a la segunda iteración va a considerar que no son la misma
                        //se salta la siguiente, terminando el proceso
                        if (row[0] != assignatures[i]) {
                            matrix = [];
                            i++;
                            break;
                        }
                        else {
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
                }
                //leyendo matriz de notas para hacer conteos
                // let counts = [0,0,0,0]
                // if (row[column] > 4.5) {
                //     counts[3] += 1
                // }
                // else if (row[column] > 4) {
                //     counts[2] += 1
                // }
                // else if (row[column] > 3) {
                //     counts[1] += 1
                // }
                // else {
                //     counts[0] += 1
                // }
                // resultData[i].data[l].counts = counts
                response.json(resultData);
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
