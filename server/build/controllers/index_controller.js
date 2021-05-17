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
exports.indexController = void 0;
const connection_1 = __importDefault(require("../connection"));
class IndexController {
    enterSystem(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            var users = yield connection_1.default.query("select * from usuarios");
            var authorization = false;
            for (let i = 0; i < users.length; i++) {
                if (request.body.username == users[i].nombre_usuario && request.body.password == users[i].clave) {
                    var token = users[i].id_usuario.toString();
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
            });
        });
    }
}
exports.indexController = new IndexController();
