import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/index_routes';
import panelRoutes from './routes/panel_routes';
import academicRoutes from './routes/academic_routes';
import reportsRoutes from './routes/reports_routes';


class Server {
    public app: Application
    private port: any

    constructor ( ) {
        this.app = express();
        this.config();
        this.routes();
        this.port = this.app.get('port');
    }
    config():void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }
    routes():void {
        this.app.use('/', indexRoutes);
        this.app.use('/panel', panelRoutes);
        this.app.use('/academic', academicRoutes);
        this.app.use('/reports', reportsRoutes);

    }
    start():void {
        this.app.listen(this.port, () => {
            console.log('Server working on port:' + this.port);
        })
    }
}

const server = new Server();
server.start();