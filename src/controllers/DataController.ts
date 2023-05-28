import {NextFunction, Request, Response} from "express";
import VisualCrossingSchema from "../model/VisualCrossingSchema";
import OpenMeteoSchema from "../model/OpenMeteoSchema";
import TomorrwSchema from "../model/TomorrwSchema";

class DataController {

    private collections: { [key: string]: any } = {
        meteoweathers: OpenMeteoSchema,
        tomorrowapis: TomorrwSchema,
        visualcrossings: VisualCrossingSchema,
    };

    public getForecast = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { collection } = req.params;
            const { date, startDate, endDate } = req.query;

            let data;

            if (date) {
                data = await this.getDataByDate(collection, date as string);
            } else if (startDate && endDate) {
                data = await this.getDataByRange(collection, startDate as string, endDate as string
                );
            } else {
                return res.status(400).json({ message: "Invalid parameters" });
            }

            if (!data) {
                return res.status(404).json({ message: "Data not found" });
            }

            res.json({ data });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "A server error has occurred" });
        }
    };

    private async getDataByDate(collection: string, date: string) {
        const Collection = this.collections[collection];
        if (!Collection) {
            return null;
        }
        return await Collection.find({ forecastFrom: new RegExp(date.split('T')[0]) })
            .sort({time: 1});
    }

    private async getDataByRange(
        collection: string,
        startDate: string,
        endDate: string
    ) {
        const Collection = this.collections[collection];
        if (!Collection) {
            return null;
        }
        return await Collection.find({
            forecastFrom: { $gte: startDate, $lte: endDate },
        }).sort({time: 1});
    }
}

export default DataController;
