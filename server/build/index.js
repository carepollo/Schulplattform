"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const index_routes_1 = __importDefault(require("./routes/index_routes"));
const panel_routes_1 = __importDefault(require("./routes/panel_routes"));
const academic_routes_1 = __importDefault(require("./routes/academic_routes"));
const reports_routes_1 = __importDefault(require("./routes/reports_routes"));
const reports_routes_2 = __importDefault(require("./routes/reports_routes"));
class Server {
    constructor() {
        this.app = express_1.default();
        this.config();
        this.routes();
        this.port = this.app.get('port');
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan_1.default('dev'));
        this.app.use(cors_1.default());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/', index_routes_1.default);
        this.app.use('/panel', panel_routes_1.default);
        this.app.use('/academic', academic_routes_1.default);
        this.app.use('/reports', reports_routes_1.default);
        this.app.use('/elections', reports_routes_2.default);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log('Server working on port:' + this.port);
        });
    }
}
const server = new Server();
server.start();
