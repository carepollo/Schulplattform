"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_controller_1 = require("../controllers/index_controller");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.post('/', index_controller_1.indexController.enterSystem);
    }
}
const indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
