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
exports.panelController = void 0;
const connection_1 = __importDefault(require("../connection"));
class PanelController {
    constructor() {
        this.query = "";
    }
    charge(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var unathourized = {
                auth: false,
                token: "unathourized"
            };
            const { ident } = request.params;
            var userId = Buffer.from(ident, "base64").toString();
            try {
                const user = yield connection_1.default.query(`SELECT * FROM usuarios WHERE id_usuario = ${userId}`);
                if (Object.entries(user).length == 1) {
                    let authUser = Object.values(user[0]);
                    const assigPerson = yield connection_1.default.query(`SELECT * FROM personas WHERE asig_usuario = ${userId}`);
                    let persondata = Object.values(assigPerson[0]);
                    let zone_expedition = yield connection_1.default.query(`SELECT id_departamento AS value , departamento AS label FROM departamentos WHERE id_departamento = ${persondata[4]}`);
                    let city_expedition = yield connection_1.default.query(`SELECT id_municipio AS value , municipio AS label FROM municipios WHERE id_municipio = ${persondata[5]}`);
                    let zone_lives = yield connection_1.default.query(`SELECT id_departamento AS value , departamento AS label FROM departamentos WHERE id_departamento = ${persondata[10]}`);
                    let city_lives = yield connection_1.default.query(`SELECT id_municipio AS value , municipio AS label FROM municipios WHERE id_municipio = ${persondata[11]}`);
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
                    };
                    let userdata = {
                        id: authUser[0],
                        username: authUser[1],
                        password: authUser[2],
                        type: authUser[3],
                        picture: authUser[4],
                        person: formattedPersonData
                    };
                    response.json(userdata);
                }
                else {
                    response.json(unathourized);
                }
            }
            catch (error) {
                unathourized.token = error;
                response.json(unathourized);
            }
        });
    }
    updateUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `UPDATE usuarios SET nombre_usuario = '${req.body.username}', clave = '${req.body.password}', foto = '${req.body.picture}' WHERE id_usuario = ${req.body.id}`;
            try {
                const userUpdate = yield connection_1.default.query(query);
                res.json({
                    operation: true,
                    query: query
                });
            }
            catch (error) {
                res.json({
                    operation: false,
                    query: error
                });
            }
        });
    }
    updatePersonData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `UPDATE personas SET id_persona = ${request.body.id_person}, t_documento = '${request.body.id_type}', nombres_persona = '${request.body.names}', apellidos_persona = '${request.body.lastnames}', departamento_expedicion = '${request.body.zone_expedition.value}', ciudad_expedicion = '${request.body.city_expedition.value}', rh = '${request.body.rh}', salud = '${request.body.health}', escalafon = '${request.body.level}', nivel_estudio = '${request.body.study}', departamento_residencia = '${request.body.zone_lives.value}', ciudad_residencia = '${request.body.city_lives.value}', direccion = '${request.body.address}', celular = '${request.body.phone}', correo = '${request.body.email}', sede = '${request.body.site}', jornada = '${request.body.scheme}' WHERE asig_usuario = ${request.body.assigned_user}`;
            try {
                const personUpdate = yield connection_1.default.query(query);
                response.json({
                    operation: true,
                    query: query
                });
            }
            catch (error) {
                response.json({
                    operation: false,
                    query: error
                });
            }
        });
    }
    listOption(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "";
            switch (request.body.tablename) {
                case "departamentos":
                    query = `SELECT id_departamento AS value , departamento AS label FROM departamentos`;
                    break;
                case "municipios":
                    query = `SELECT id_municipio AS value , municipio AS label FROM municipios WHERE departamento_id = ${request.body.selectId}`;
                    break;
                case "dep_grados_materia":
                    query = `SELECT materia_grado AS label FROM ${request.body.tablename} WHERE grado_corresponde = '${request.body.selectId}'`;
                    break;
            }
            try {
                const selectList = yield connection_1.default.query(query);
                response.json(selectList);
            }
            catch (error) {
                response.json({
                    operation: false,
                    query: error
                });
            }
        });
    }
}
exports.panelController = new PanelController();
