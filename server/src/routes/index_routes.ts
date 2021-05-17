import {Router} from 'express';
import {indexController} from '../controllers/index_controller';

class IndexRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.post('/', indexController.enterSystem);
    }
}

const indexRoutes = new IndexRoutes();
export default indexRoutes.router;