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
}
exports.academicController = new AcademicController();
