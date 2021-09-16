import { Router } from "express";
import { electionsController } from "../controllers/elections_controller";

class ElectionsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get("/getAllElections/:ident", electionsController.getSurveys)
        this.router.post("/postElection", electionsController.saveSurvey)
        this.router.post("/vote", electionsController.vote)
    }
}
const electionsRoutes = new ElectionsRoutes();
export default electionsRoutes.router;