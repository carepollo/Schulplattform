import {json, query, Request, Response} from 'express';
import link_db from '../connection';
import Utilities from '../Utilities';

class ManagementController {

    async getPersonsList(req:Request, res:Response) {
        try {
            const data = await link_db.query("SELECT id_persona as id, CONCAT(nombres_persona, ' ', apellidos_persona) as fullname, tipo as type, asig_usuario as user FROM personas")
            res.json(data)
        }
        catch (error) {
            console.log(error)
        }
    }

    async getPersonInfo(req:Request, res:Response) {
        try {
            const {ident} = req.params;
            let main = await link_db.query(`SELECT * FROM personas WHERE id_persona = ${ident}`);
            const person = main[0];

            main = await link_db.query(`SELECT * FROM usuarios WHERE id_usuario = ${person["asig_usuario"]}`);
            const user = (main.length > 0) ? main[0] : {id_usuario:null,nombre_usuario:"",clave:"", tipo:""};

            const info = {
                id: user["id_usuario"],
                username: user["nombre_usuario"],
                password: user["clave"],
                type: user["tipo"],
                person: {
                    id_person:person["id_persona"],
                    id_type:person["t_documento"],
                    names:person["nombres_persona"],
                    lastnames:person["apellidos_persona"],
                    zone_expedition:person["departamento_expedicion"],
                    city_expedition:person["ciudad_expedicion"],
                    rh:person["rh"],
                    health:person["salud"],
                    level:person["escalafon"],
                    study:person["nivel_estudio"],
                    zone_lives:person["departamento_residencia"],
                    city_lives:person["ciudad_residencia"],
                    address:person["direccion"],
                    phone:person["celular"],
                    email:person["correo"],
                    site:person["sede"],
                    scheme:person["jornada"],
                    assigned_user:person["asig_usuario"],
                    type:person["tipo"]
                }
            }
            res.json({
                status:200,
                message:info
            });
        }
        catch (error) {
            console.error(error);
            
            res.json({
                status:500,
                message:"Se presentó un error interno"
            });
        }
    }

    async handlePerson(req:Request, res:Response) {
        try {
            const user = req.body;
            const person = user.person;
            let createdUser:boolean = false;
            let asigUser:string|null = "";

            if (user["username"] != "") {
                if (user.id != "" || user.id != 0) {
                    const userInsertion = await link_db.query(`UPDATE usuarios SET nombre_usuario = '${user["username"]}', clave = '${user["password"]}', tipo = '${user["type"]}' WHERE id_person = ${user["id"]}'`);
                }
                else {
                    const userInsertion = await link_db.query(`INSERT INTO usuarios(nombre_usuario, clave, tipo) VALUES('${user["username"]}', '${user["password"]}'', '${user["type"]}')`);
                    const userId:any = await link_db.query("SELECT id_usuario FROM usuarios ORDER BY id_usuario DESC LIMIT 1");
                    asigUser = userId[0]["id_usuario"];
                }
            }
            if (person["id_person"] != "" || person["id_person"] == undefined) {
                const exists:any = await link_db.query(`SELECT id_persona FROM personas WHERE id_persona = ${person["id_person"]}`);
                asigUser = (asigUser == "") ? null : asigUser;
                console.log(exists[0]);
                if (exists.length > 0) {
                    const personInsertion = link_db.query(`
                        UPDATE personas SET 
                            id_persona = '${person["id_person"]}',
                            t_documento = '${person["id_type"]}',
                            nombres_persona = '${person["names"]}',
                            apellidos_persona = '${person["lastnames"]}',
                            departamento_expedicion = '${person["zone_expedition"]}',
                            ciudad_expedicion = '${person["city_expedition"]}',
                            rh = '${person["rh"]}',
                            salud = '${person["health"]}',
                            escalafon = '${person["level"]}',
                            nivel_estudio = '${person["study"]}',
                            departamento_residencia = '${person["zone_lives"]}',
                            ciudad_residencia = '${person["city_lives"]}',
                            direccion = '${person["address"]}',
                            celular = '${person["phone"]}',
                            correo = '${person["email"]}',
                            sede = '${person["site"]}',
                            jornada = '${person["scheme"]}',
                            tipo = '${person["type"]}'
                        WHERE id_persona = '${person["id_person"]}'
                    `);
                    console.log(personInsertion);
                    res.json({
                        "status":200,
                        "message":"Usuario actualizado exitosamente"
                    });
                    return true;
                }
                else {
                    const personInsertion = await link_db.query(`
                        INSERT INTO personas (
                            id_persona,
                            t_documento,
                            nombres_persona,
                            apellidos_persona,
                            departamento_expedicion,
                            ciudad_expedicion,
                            rh,
                            salud,
                            escalafon,
                            nivel_estudio,
                            departamento_residencia,
                            ciudad_residencia,
                            direccion, 
                            celular,
                            correo,
                            sede,
                            jornada,
                            asig_usuario,
                            tipo
                            ) VALUES(
                                '${person["id_person"]}',
                                '${person["id_type"]}',
                                '${person["names"]}',
                                '${person["lastnames"]}',
                                '${person["zone_expedition"]}',
                                '${person["city_expedition"]}',
                                '${person["rh"]}',
                                '${person["health"]}',
                                '${person["level"]}',
                                '${person["study"]}',
                                '${person["zone_lives"]}',
                                '${person["city_lives"]}',
                                '${person["address"]}',
                                '${person["phone"]}',
                                '${person["email"]}',
                                '${person["site"]}',
                                '${person["scheme"]}',
                                ${asigUser},
                                '${person["type"]}'
                            )
                    `)
                    console.log(personInsertion);
                    res.json({
                        "status":200,
                        "message":"Usuario Creado exitosamente"
                    });
                    return true;

                }
            }
        }
        catch (error) {
            console.error(error);
            res.json({
                status:500,
                message:"Se presentó un error interno"
            });
        }
    }
}

export const managementController = new ManagementController();