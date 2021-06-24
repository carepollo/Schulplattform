import {Router} from 'express';
import {academicController} from '../controllers/academic_controller';

class AcademicRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/badges/:table', academicController.getBadgesTable)
        this.router.post('/badges/update', academicController.updateBadgeData)
        this.router.get('/badges/delete/:deleted', academicController.deleteBadge)
        this.router.post('/badges/insert', academicController.createBadge)
        this.router.post('/grades/get', academicController.getGrades)
        this.router.post('/grades/update', academicController.updateGrade)
        this.router.get('/observations/get/many/:requested', academicController.getGroupMembers)
        this.router.get('/observations/get/single/:requested', academicController.getObservationsStudent)
        this.router.get('/observations/delete/:deleted', academicController.deleteObservation)
        this.router.post('/observations/update', academicController.updateObservation)
        this.router.post('/observations/create', academicController.createObservation)
    }
}

const panelRoutes = new AcademicRoutes();
export default panelRoutes.router;