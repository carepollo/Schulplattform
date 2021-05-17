import {Request, Response} from 'express';
import link_db from '../connection';
import jwt from 'jsonwebtoken';
import jwt_decode from 'jwt-decode';

class IndexController {

    public token:any;

    public async enterSystem(request:Request, response:Response): Promise<void> {
        var users = await link_db.query("select * from usuarios");
        var authorization = false;

        for (let i = 0; i < users.length; i++) {
            if (request.body.username == users[i].nombre_usuario && request.body.password == users[i].clave) {
                var token = users[i].id_usuario.toString()
                authorization = true;
                break;
            }
            else {
                token = "unathourized";
                continue;
            }
        }
        response.json({
            auth: authorization,
            token: Buffer.from(token).toString("base64")
        })
    }
}

export const indexController = new IndexController();