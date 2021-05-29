import {json, Request, response, Response} from 'express';
import link_db from '../connection';


class AcademicController {

    public async getBadgesTable(request:Request, response:Response) {
        const {table} = request.params
        let query = ""
        switch (table) {
            case 'logros':
                query = "SELECT id, grado_logro as grade, nivel as level, descripcion as description, materia as assignature FROM logros"
                break;
        }
        try {
            const badgesTable = await link_db.query(query)
            response.json(badgesTable)
        }
        catch (error) {
            response.send("error: " + error)
        }
    }

    public async updateBadgeData(request:Request, response:Response){
        try{
            let query = `UPDATE logros SET descripcion = '${request.body.description}' WHERE id = ${request.body.id}`
            let update = await link_db.query(query)
            response.json(update)
        }
        catch(err) {
            response.json(err)
        }
    }

    public async deleteBadge(request:Request, response:Response) {
        const {deleted} = request.params
        let query = `DELETE FROM logros WHERE id = ${deleted}`;
        try {
            await link_db.query(query)
            response.json(true)
        }
        catch(error) {
            response.send(false)
        }
    }

    public async createBadge(request:Request, response:Response) {
        let query = `INSERT INTO logros (grado_logro, nivel, descripcion, materia) VALUES ('${request.body.grade}','${request.body.level}','${request.body.description}','${request.body.assignature}')`;
        try {
            await link_db.query(query)
            response.send(true)
        }
        catch(error) {
            response.send(false)
        }
    }
    

    //select * from notas where estudiante_corresponde = (select persona from dep_grupos_persona where grupo_corresponde = (select id from grupos where grado ="Segundo" and nomenclatura_grupo = 1 and jornada = "Mañana" and sede = "San José"));


}

export const academicController = new AcademicController();