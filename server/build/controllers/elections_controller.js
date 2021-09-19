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
exports.electionsController = void 0;
const connection_1 = __importDefault(require("../connection"));
class ElectionsController {
    //para llamar una lista con un objeto con todas las encuestas existentes, vencidas, en las que ya se voto o no
    getSurveys(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dataHeaders = yield connection_1.default.query(`SELECT id, titulo AS title, DATE_FORMAT(fechaInicio, '%Y-%m-%d') AS dateStart,  DATE_FORMAT(fechaFin, '%Y-%m-%d') AS dateEnd, descripcion AS description FROM votaciones ORDER BY id DESC`);
                //si existen encuestas, comprobación para asegurar que no ocurran errores
                if (dataHeaders.length < 1) {
                    res.json({
                        status: 500,
                        message: "No hay votaciones actualmente"
                    });
                }
                else {
                    const now = new Date();
                    const { ident } = req.params;
                    //proceso por cada encuesta si todo sale bien
                    for (let i = 0; i < dataHeaders.length; i++) {
                        const survey = dataHeaders[i];
                        //sumar un día para que tener en cuenta las horas del día final
                        const closeDate = new Date(survey.dateEnd);
                        closeDate.setDate(closeDate.getDate() + 1);
                        //comprobar si ha votado, de ser así, por cual opción
                        const questionsSurvey = yield connection_1.default.query(`SELECT id, pregunta AS name FROM preguntas_votacion WHERE encuesta = ${survey["id"]}`);
                        const votedSurvey = yield connection_1.default.query(`SELECT opcion FROM dep_votaciones_personas AS a WHERE a.persona = ${ident} AND (SELECT encuesta FROM preguntas_votacion WHERE id = a.opcion) = ${survey["id"]}`);
                        //determinar opción votada y conteo de votos
                        for (let l = 0; l < questionsSurvey.length; l++) {
                            const option = questionsSurvey[l];
                            const manyVotes = yield connection_1.default.query(`SELECT count(id) AS conteoVotos FROM dep_votaciones_personas WHERE opcion = ${option["id"]}`);
                            if (votedSurvey.length > 0) {
                                option["selected"] = (option["id"] == votedSurvey[0]["opcion"]);
                            }
                            else {
                                option["selected"] = false;
                            }
                            option["count"] = manyVotes[0]["conteoVotos"];
                        }
                        //disponible de votar o no, si ha votado o se venció la votacion
                        const state = (now > closeDate || votedSurvey.length > 0);
                        survey.options = questionsSurvey;
                        survey.state = state;
                    }
                    res.json({
                        status: 200,
                        message: dataHeaders
                    });
                }
            }
            catch (error) {
                console.log(error);
                res.json({
                    status: 500,
                    message: "No se pudieron traer los datos"
                });
            }
        });
    }
    //este método es para la publicación de una encuesta, toma la cabecera de la encuesta 
    saveSurvey(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const datasource = req.body;
                let qnInsert = [];
                const createdSurvey = yield connection_1.default.query(`INSERT INTO votaciones (titulo, fechaInicio, fechaFin, descripcion) VALUES ('${datasource.title}' , '${datasource.dateStart}' , '${datasource.dateEnd}', '${datasource.description}')`);
                const surveyId = yield connection_1.default.query(`SELECT id FROM votaciones ORDER BY id DESC LIMIT 1`);
                //formación de preguntas
                for (let i = 0; i < datasource.options.length; i++) {
                    const element = datasource.options[i];
                    qnInsert.push(`(${surveyId[0]["id"]}, '${element.name}')`);
                }
                const questions = qnInsert.join(",");
                const createdQuestions = yield connection_1.default.query(`INSERT INTO preguntas_votacion (encuesta, pregunta) VALUES ${questions}`);
                res.json({
                    status: 200,
                    message: "Encuesta creada"
                });
            }
            catch (error) {
                console.log(error);
                res.json({
                    status: 500,
                    message: "No se pudo publicar"
                });
            }
        });
    }
    //registrar un voto, recibe el ID de la opción y el id personal de quien vota
    vote(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const register = yield connection_1.default.query(`INSERT INTO dep_votaciones_personas (persona, opcion) VALUES (${req.body.votant}, ${req.body.option})`);
                res.json({
                    status: 200,
                    message: "Voto registrado exitosamente"
                });
            }
            catch (error) {
                console.log(error);
                res.json({
                    status: 500,
                    message: "No se pudo publicar"
                });
            }
        });
    }
}
exports.electionsController = new ElectionsController();
