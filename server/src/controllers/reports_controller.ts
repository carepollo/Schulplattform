import {json, Request, Response} from 'express';
import link_db from '../connection';

class ReportsController {


    public async getGraphs(request:Request, response:Response) {
        try {
            
        }
        catch (error) {
            response.json({
                status:500,
                message: error
            })
        }
    }

}

export const reportsController = new ReportsController()