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
exports.academicController = void 0;
const connection_1 = __importDefault(require("../connection"));
class AcademicController {
    getBadgesTable(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { table } = request.params;
            let query = "";
            switch (table) {
                case 'logros':
                    query = "SELECT id, grado_logro as grade, nivel as level, descripcion as description, materia as assignature FROM logros";
                    break;
            }
            try {
                const badgesTable = yield connection_1.default.query(query);
                response.json(badgesTable);
            }
            catch (error) {
                response.send("error: " + error);
            }
        });
    }
    updateBadgeData(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = `UPDATE logros SET descripcion = '${request.body.description}' WHERE id = ${request.body.id}`;
                let update = yield connection_1.default.query(query);
                response.json(update);
            }
            catch (err) {
                response.json(err);
            }
        });
    }
    deleteBadge(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deleted } = request.params;
            let query = `DELETE FROM logros WHERE id = ${deleted}`;
            try {
                yield connection_1.default.query(query);
                response.json(true);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    createBadge(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `INSERT INTO logros (grado_logro, nivel, descripcion, materia) VALUES ('${request.body.grade}','${request.body.level}','${request.body.description}','${request.body.assignature}')`;
            try {
                yield connection_1.default.query(query);
                response.send(true);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    getGrades(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `SELECT notas.id_nota as id, nota_p1 as g1, nota_p2 as g2, nota_p3 as g3, nota_p4 as g4, nota_final as final , personas.id_persona as id_student , concat(personas.nombres_persona, " ", personas.apellidos_persona) as fullname FROM notas INNER JOIN personas ON notas.estudiante_corresponde = personas.id_persona WHERE periodo_corresponde = NOW() AND materia_corresponde = ${request.body.data.assignature} AND estudiante_corresponde IN (SELECT persona FROM dep_grupos_persona WHERE personas.tipo = "Estudiante" AND grupo_corresponde = (SELECT id FROM grupos WHERE grado = "${request.body.data.grade}" AND nomenclatura_grupo = ${request.body.data.group} AND jornada = "${request.body.data.scheme}" AND sede = "${request.body.data.place}"))`;
            try {
                const grades = yield connection_1.default.query(query);
                response.json(grades);
            }
            catch (error) {
                response.json(error);
            }
        });
    }
    updateGrade(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `UPDATE notas SET nota_p1 = ${request.body.g1}, nota_p2 = ${request.body.g2}, nota_p3 = ${request.body.g3}, nota_p4 = ${request.body.g4}, nota_final = ${request.body.final} WHERE id_nota = ${request.body.id}`;
            try {
                const updated = yield connection_1.default.query(query);
                response.send(true);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    getGroupMembers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requested } = request.params;
            let query = `SELECT personas.id_persona as id, concat(personas.nombres_persona, " ", personas.apellidos_persona) as fullname FROM personas WHERE personas.tipo = "Estudiante" AND id_persona IN (SELECT persona FROM dep_grupos_persona WHERE grupo_corresponde = ${requested});`;
            try {
                const gotGroup = yield connection_1.default.query(query);
                response.json(gotGroup);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    getObservationsStudent(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { requested } = request.params;
            let query = `SELECT id as idOb, fecha as createdDate, descripcion as description, autor as author, sujeto_destinatario as observed FROM observaciones WHERE sujeto_destinatario = ${requested}`;
            try {
                const gotGroup = yield connection_1.default.query(query);
                response.json(gotGroup);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    updateObservation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `UPDATE observaciones SET fecha = '${request.body.createdDate}' , autor = '${request.body.author}' , descripcion = '${request.body.description}' WHERE id = ${request.body.idOb}`;
            try {
                yield connection_1.default.query(query);
                response.send(true);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    deleteObservation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deleted } = request.params;
            console.log(deleted);
            let query = `DELETE FROM observaciones WHERE id = ${deleted}`;
            console.log(query);
            try {
                yield connection_1.default.query(query);
                response.send(true);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
    createObservation(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = `INSERT INTO observaciones (fecha, descripcion, autor, sujeto_destinatario) VALUES ('${request.body.createdDate}', '${request.body.description}', '${request.body.author}', '${request.body.observed}')`;
            try {
                yield connection_1.default.query(query);
                response.send(true);
            }
            catch (error) {
                response.send(false);
            }
        });
    }
}
exports.academicController = new AcademicController();
