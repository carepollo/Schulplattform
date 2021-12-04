import { Router } from "express";
import { managementController } from "../controllers/management_controller";

class ManagementRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get("/getAllUsers", managementController.getPersonsList);
        this.router.get("/getUser/:ident", managementController.getPersonInfo);
        this.router.post("/handlePerson", managementController.handlePerson);

    }
}
const managementRoutes = new ManagementRoutes();
export default managementRoutes.router;