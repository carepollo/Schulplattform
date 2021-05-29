"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const academic_controller_1 = require("../controllers/academic_controller");
class AcademicRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/badges/:table', academic_controller_1.academicController.getBadgesTable);
        this.router.post('/badges/update', academic_controller_1.academicController.updateBadgeData);
        this.router.get('/badges/delete/:deleted', academic_controller_1.academicController.deleteBadge);
        this.router.post('/badges/insert', academic_controller_1.academicController.createBadge);
    }
}
const panelRoutes = new AcademicRoutes();
exports.default = panelRoutes.router;
