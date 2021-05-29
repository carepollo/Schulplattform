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
    }
}

const panelRoutes = new PanelRoutes();
export default panelRoutes.router;