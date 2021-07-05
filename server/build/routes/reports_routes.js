"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reports_controller_1 = require("../controllers/reports_controller");
class ReportsRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/badges/:table', reports_controller_1.reportsController.getGraphs);
    }
}
const reportsRoutes = new ReportsRoutes();
exports.default = reportsRoutes.router;
