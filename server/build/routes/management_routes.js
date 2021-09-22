"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const management_controller_1 = require("../controllers/management_controller");
class ElectionsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get("/getAllElections/:ident", management_controller_1.managementController.getPersonsList);
    }
}
const electionsRoutes = new ElectionsRoutes();
exports.default = electionsRoutes.router;
