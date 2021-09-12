import {json, Request, response, Response} from 'express';
import link_db from '../connection';


class PanelController {

    public query:string = ""

    public async charge(request:Request, response:Response) {
        var unathourized = {
            auth: false,
            token: "unathourized"
        }
        const {ident} = request.params
        var userId = Buffer.from(ident, "base64").toString()
        try {
            const user = await link_db.query(`SELECT * FROM usuarios WHERE id_usuario = ${userId}`)
            if (Object.entries(user).length == 1) {
                let authUser = Object.values(user[0])

                const assigPerson = await link_db.query(`SELECT * FROM personas WHERE asig_usuario = ${userId}`)
                let persondata = Object.values(assigPerson[0])
                
                let zone_expedition = await link_db.query(`SELECT id_departamento AS value , departamento AS label FROM departamentos WHERE id_departamento = ${persondata[4]}`)
                let city_expedition = await link_db.query(`SELECT id_municipio AS value , municipio AS label FROM municipios WHERE id_municipio = ${persondata[5]}`)
                let zone_lives = await link_db.query(`SELECT id_departamento AS value , departamento AS label FROM departamentos WHERE id_departamento = ${persondata[10]}`)
                let city_lives = await link_db.query(`SELECT id_municipio AS value , municipio AS label FROM municipios WHERE id_municipio = ${persondata[11]}`)

                let formattedPersonData = {
                    id_person: persondata[0],
                    id_type: persondata[1],
                    names: persondata[2],
                    lastnames: persondata[3],
                    zone_expedition: zone_expedition[0],
                    city_expedition: city_expedition[0],
                    rh: persondata[6],
                    health: persondata[7],
                    level: persondata[8],
                    study: persondata[9],
                    zone_lives: zone_lives[0],
                    city_lives: city_lives[0],
                    address: persondata[12],
                    phone: persondata[13],
                    email: persondata[14],
                    site: persondata[15],
                    scheme: persondata[16],
                    assigned_user: persondata[17]
                }
                let userdata = {
                    id: authUser[0],
                    username: authUser[1],
                    password: authUser[2],
                    type: authUser[3],
                    picture: authUser[4],
                    person: formattedPersonData
                }
                response.json(userdata)
            }
            else {
                response.json(unathourized)
            }
                
        }
        catch (error) {
            unathourized.token = "error"
            response.json(unathourized)
        }
    }

    public async updateUserData(req: Request, res: Response) {
        let query = `UPDATE usuarios SET nombre_usuario = '${req.body.username}', clave = '${req.body.password}', foto = '${req.body.picture}' WHERE id_usuario = ${req.body.id}`
        try {
            const userUpdate = await link_db.query(query);  
            res.json({
                operation: true,
                query: query
            })
        }
        catch (error) {
            res.json({
                operation: false,
                query: error
            })
        }        
    }
    public async updatePersonData(request: Request, response:Response) {
        let query = `UPDATE personas SET id_persona = ${request.body.id_person}, t_documento = '${request.body.id_type}', nombres_persona = '${request.body.names}', apellidos_persona = '${request.body.lastnames}', departamento_expedicion = '${request.body.zone_expedition.value}', ciudad_expedicion = '${request.body.city_expedition.value}', rh = '${request.body.rh}', salud = '${request.body.health}', escalafon = '${request.body.level}', nivel_estudio = '${request.body.study}', departamento_residencia = '${request.body.zone_lives.value}', ciudad_residencia = '${request.body.city_lives.value}', direccion = '${request.body.address}', celular = '${request.body.phone}', correo = '${request.body.email}', sede = '${request.body.site}', jornada = '${request.body.scheme}' WHERE asig_usuario = ${request.body.assigned_user}`;
        try {
            const personUpdate = await link_db.query(query)        
            response.json({
                operation: true,
                query: query
            })
        }
        catch (error) {
            response.json({
                operation: false,
                query: error
            })
        }

    }

    public async listOption(request:Request, response:Response) {
        let query = "";
        switch (request.body.tablename) {
            case "departamentos":
                query = `SELECT id_departamento AS value , departamento AS label FROM departamentos`
                break;
            case "municipios":
                query = `SELECT id_municipio AS value , municipio AS label FROM municipios WHERE departamento_id = ${request.body.selectId}`
                break;
            case "dep_grados_materia":
                query = `SELECT materia_grado AS label, id as value FROM ${request.body.tablename} WHERE grado_corresponde = '${request.body.selectId}'`
                break;
            case "grupos":
                query = `SELECT grado as label, nomenclatura_grupo as value FROM grupos WHERE sede = '${request.body.selectId.place}' AND jornada = '${request.body.selectId.scheme}';`
                break;
            case "gruposTotal":
                query = `SELECT concat(sede, " -> ", jornada , " -> ", grado, " ", nomenclatura_grupo) as label, id as value  FROM grupos`
                break;
            case "gradosTodo":
                query = `SELECT nombre as label FROM grados`
                break;
        }
        try {
            const selectList = await link_db.query(query)
            response.json(selectList)
        }
        catch (error) {
            response.json({
                operation: false,
                query: error
            })
        }
    }

}

export const panelController = new PanelController();