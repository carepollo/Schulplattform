import {Router} from 'express';
import {panelController} from '../controllers/panel_controller';

class PanelRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/:ident', panelController.charge)
        this.router.post('/userprofile/user', panelController.updateUserData)
        this.router.post('/userprofile/person', panelController.updatePersonData)
        this.router.post('/userprofile/selector', panelController.listOption)
        this.router.get('/academic/badges/:table', panelController.getBadgesTable)
        this.router.post('/academic/badge/update', panelController.updateBadgeData)
    }
}

const panelRoutes = new PanelRoutes();
export default panelRoutes.router;