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
        this.router.get('/observations/get/:requested', academicController.getGroupMembers)
    }
}

const panelRoutes = new AcademicRoutes();
export default panelRoutes.router;