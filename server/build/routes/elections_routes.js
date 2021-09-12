"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const elections_controller_1 = require("../controllers/elections_controller");
class ElectionsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get("/getAllSurveys", elections_controller_1.electionsController.getSurveys);
        this.router.post("/postSurvey", elections_controller_1.electionsController.saveSurvey);
    }
}
const electionsRoutes = new ElectionsRoutes();
exports.default = electionsRoutes.router;
