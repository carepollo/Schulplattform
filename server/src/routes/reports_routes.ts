import {Router} from 'express';
import {reportsController} from '../controllers/reports_controller';


class ReportsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.post('/graphs', reportsController.getGraphs)
    }
}

const reportsRoutes = new ReportsRoutes();
export default reportsRoutes.router;