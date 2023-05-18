import {ForecastSchema, IForecast} from "./Forecast";
import mongoose from "mongoose";

export interface IVisualCrossing extends IForecast{

}

export interface IVisualCrossingModel extends IVisualCrossing, Document {

}

export default mongoose.model<IVisualCrossingModel>('VisualCrossing', ForecastSchema);
