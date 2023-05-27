import express from 'express';
import DataController from "../controllers/DataController";

class ForecastRoutes {
    public router: express.Router;
    private dataController: DataController;

    constructor() {
        this.router = express.Router();
        this.dataController = new DataController();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/:collection', this.dataController.getForecast);
    }
}
export default ForecastRoutes;

