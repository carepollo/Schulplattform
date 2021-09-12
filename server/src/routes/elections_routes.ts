import { Router } from "express";
import { electionsController } from "../controllers/elections_controller";

class ElectionsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get("/getAllSurveys", electionsController.getSurveys)
        this.router.post("/postSurvey", electionsController.saveSurvey)
    }
}
const electionsRoutes = new ElectionsRoutes();
export default electionsRoutes.router;