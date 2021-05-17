"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_mysql_1 = __importDefault(require("promise-mysql"));
const configDB_1 = __importDefault(require("./configDB"));
const link_db = promise_mysql_1.default.createPool(configDB_1.default.access);
link_db.getConnection().then(connection => {
    link_db.releaseConnection(connection);
    console.log('Database On');
});
exports.default = link_db;
