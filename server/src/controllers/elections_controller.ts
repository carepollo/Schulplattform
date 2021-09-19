import { Request, Response } from "express";

import link_db from '../connection';
import Utilities from '../Utilities';

class ElectionsController {

    //para llamar una lista con un objeto con todas las encuestas existentes, vencidas, en las que ya se voto o no
    async getSurveys(req:Request, res:Response) {
        try {
            const dataHeaders:any = await link_db.query(`SELECT id, titulo AS title, DATE_FORMAT(fechaInicio, '%Y-%m-%d') AS dateStart,  DATE_FORMAT(fechaFin, '%Y-%m-%d') AS dateEnd, descripcion AS description FROM votaciones ORDER BY id DESC`)

            //si existen encuestas, comprobación para asegurar que no ocurran errores
            if (dataHeaders.length < 1) {
                res.json({
                    status: 500,
                    message: "No hay votaciones actualmente"
                });
            }
            else {
                const now:Date = new Date();
                const {ident} = req.params;

                //proceso por cada encuesta si todo sale bien
                for (let i = 0; i < dataHeaders.length; i++) {
                    const survey = dataHeaders[i];
                    
                    //sumar un día para que tener en cuenta las horas del día final
                    const closeDate:Date = new Date(survey.dateEnd);
                    closeDate.setDate(closeDate.getDate() + 1);
                    
                    //comprobar si ha votado, de ser así, por cual opción
                    const questionsSurvey = await link_db.query(`SELECT id, pregunta AS name FROM preguntas_votacion WHERE encuesta = ${survey["id"]}`);
                    const votedSurvey = await link_db.query(`SELECT opcion FROM dep_votaciones_personas AS a WHERE a.persona = ${ident} AND (SELECT encuesta FROM preguntas_votacion WHERE id = a.opcion) = ${survey["id"]}`);
                    
                    //determinar opción votada y conteo de votos
                    for (let l = 0; l < questionsSurvey.length; l++) {                        
                        const option = questionsSurvey[l];
                        const manyVotes = await link_db.query(`SELECT count(id) AS conteoVotos FROM dep_votaciones_personas WHERE opcion = ${option["id"]}`);
                        
                        if (votedSurvey.length > 0) {
                            option["selected"] = (option["id"] == votedSurvey[0]["opcion"]);
                        }
                        else {
                            option["selected"] = false;
                        }
                        option["count"] = manyVotes[0]["conteoVotos"];
                    }
                    
                    //disponible de votar o no, si ha votado o se venció la votacion
                    const state:boolean = (now > closeDate || votedSurvey.length > 0);
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
            console.log(error)
            res.json({
                status: 500,
                message: "No se pudieron traer los datos"
            })
        }
    }

    //este método es para la publicación de una encuesta, toma la cabecera de la encuesta 
    async saveSurvey(req:Request, res:Response) {
        try {
            const datasource:any = req.body
            let qnInsert:string[] = []
            const createdSurvey = await link_db.query(`INSERT INTO votaciones (titulo, fechaInicio, fechaFin, descripcion) VALUES ('${datasource.title}' , '${datasource.dateStart}' , '${datasource.dateEnd}', '${datasource.description}')`)
            const surveyId = await link_db.query(`SELECT id FROM votaciones ORDER BY id DESC LIMIT 1`)

            //formación de preguntas
            for (let i = 0; i < datasource.options.length; i++) {
                const element = datasource.options[i];
                qnInsert.push(`(${surveyId[0]["id"]}, '${element.name}')`)
            }
            const questions:string = qnInsert.join(",")
            const createdQuestions = await link_db.query(`INSERT INTO preguntas_votacion (encuesta, pregunta) VALUES ${questions}`)

            res.json({
                status: 200,
                message: "Encuesta creada"
            })
        }
        catch (error) {
            console.log(error)
            res.json({
                status: 500,
                message: "No se pudo publicar"
            })
        }
    }

    //registrar un voto, recibe el ID de la opción y el id personal de quien vota
    async vote(req:Request, res:Response) {
        try {
            const register = await link_db.query(`INSERT INTO dep_votaciones_personas (persona, opcion) VALUES (${req.body.votant}, ${req.body.option})`)
            res.json({
                status: 200,
                message: "Voto registrado exitosamente"
            })
        }
        catch (error) {
            console.log(error)
            res.json({
                status: 500,
                message: "No se pudo publicar"
            })
        }
    }
}
export const electionsController = new ElectionsController()