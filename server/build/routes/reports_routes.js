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
        this.router.post('/graphBehaviour', reports_controller_1.reportsController.getGraphs);
        this.router.post('/gradesTable', reports_controller_1.reportsController.getFullTable);
        // this.router.post('/studentsList', reportsController.getList)
    }
}
const reportsRoutes = new ReportsRoutes();
exports.default = reportsRoutes.router;
