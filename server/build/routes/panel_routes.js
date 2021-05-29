"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const panel_controller_1 = require("../controllers/panel_controller");
class PanelRoutes {
    constructor() {
        this.router = express_1.Router();
        this.config();
    }
    config() {
        this.router.get('/:ident', panel_controller_1.panelController.charge);
        this.router.post('/userprofile/user', panel_controller_1.panelController.updateUserData);
        this.router.post('/userprofile/person', panel_controller_1.panelController.updatePersonData);
        this.router.post('/userprofile/selector', panel_controller_1.panelController.listOption);
    }
}
const panelRoutes = new PanelRoutes();
exports.default = panelRoutes.router;
