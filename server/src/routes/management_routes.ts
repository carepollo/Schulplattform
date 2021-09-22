import { Router } from "express";
import { managementController } from "../controllers/management_controller";

class ElectionsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get("/getAllElections/:ident", managementController.getPersonsList)
    }
}
const electionsRoutes = new ElectionsRoutes();
export default electionsRoutes.router;