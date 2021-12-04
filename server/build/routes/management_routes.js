"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const management_controller_1 = require("../controllers/management_controller");
class ManagementRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get("/getAllUsers", management_controller_1.managementController.getPersonsList);
        this.router.get("/getUser/:ident", management_controller_1.managementController.getPersonInfo);
        this.router.post("/handlePerson", management_controller_1.managementController.handlePerson);
    }
}
const managementRoutes = new ManagementRoutes();
exports.default = managementRoutes.router;
