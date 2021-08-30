import {Router} from 'express';
import {reportsController} from '../controllers/reports_controller';


class ReportsRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.post('/graphBehaviour', reportsController.getGraphs)
        this.router.post('/gradesTable', reportsController.getFullTable)
        this.router.post('/getReport', reportsController.getReport)
    }
}

const reportsRoutes = new ReportsRoutes();
export default reportsRoutes.router;