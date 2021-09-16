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
        this.router.get("/getAllElections/:ident", elections_controller_1.electionsController.getSurveys);
        this.router.post("/postElection", elections_controller_1.electionsController.saveSurvey);
        this.router.post("/vote", elections_controller_1.electionsController.vote);
    }
}
const electionsRoutes = new ElectionsRoutes();
exports.default = electionsRoutes.router;
