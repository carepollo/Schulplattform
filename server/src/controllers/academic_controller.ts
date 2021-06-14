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
        let query = `DELETE FROM logros WHERE id = ${deleted}`
        try {
            await link_db.query(query)
            response.json(true)
        }
        catch(error) {
            response.send(false)
        }
    }

    public async createBadge(request:Request, response:Response) {
        let query = `INSERT INTO logros (grado_logro, nivel, descripcion, materia) VALUES ('${request.body.grade}','${request.body.level}','${request.body.description}','${request.body.assignature}')`
        try {
            await link_db.query(query)
            response.send(true)
        }
        catch(error) {
            response.send(false)
        }
    }

    public async getGrades(request:Request, response:Response){
        let query = `SELECT notas.id_nota as id, nota_p1 as g1, nota_p2 as g2, nota_p3 as g3, nota_p4 as g4, nota_final as final , personas.id_persona as id_student , concat(personas.nombres_persona, " ", personas.apellidos_persona) as fullname FROM notas INNER JOIN personas ON notas.estudiante_corresponde = personas.id_persona WHERE materia_corresponde = ${request.body.data.assignature} AND estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = (SELECT id FROM grupos WHERE grado = "${request.body.data.grade}" AND nomenclatura_grupo = ${request.body.data.group} AND jornada = "${request.body.data.scheme}" AND sede = "${request.body.data.place}"))`
        try {
            const grades = await link_db.query(query)
            response.json(grades)
        }
        catch (error) {
            response.json(error)
        }
    }

    public async updateGrade(request:Request, response:Response) {
        let query = `UPDATE notas SET nota_p1 = ${request.body.g1}, nota_p2 = ${request.body.g2}, nota_p3 = ${request.body.g3}, nota_p4 = ${request.body.g4}, nota_final = ${request.body.final} WHERE id_nota = ${request.body.id}`
        try {
            const updated = await link_db.query(query)
            response.send(true)
        }
        catch (error) {
            response.send(false)
        }
    }

    public async getGroupMembers(request:Request, response:Response) {
        const {requested} = request.params
        let query = `SELECT personas.id_persona as id, concat(personas.nombres_persona, " ", personas.apellidos_persona) as fullname FROM personas WHERE id_persona IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${requested});`
        try {
            const gotGroup = await link_db.query(query)
            response.json(gotGroup)
        }
        catch (error) {
            response.send(false)
        }
    }

    public async getObservationsStudent(request:Request, response:Response) {
        const {requested} = request.params
        let query = `SELECT id as idOb, fecha as createdDate, descripcion as description, autor as author, sujeto_destinatario as observed FROM observaciones WHERE sujeto_destinatario = ${requested};`
        try {
            const gotGroup = await link_db.query(query)
            response.json(gotGroup)
        }
        catch (error) {
            response.send(false)
        }
    }

}

export const academicController = new AcademicController();