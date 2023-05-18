import mongoose from "mongoose";
import {ForecastSchema, IForecast} from "./Forecast";

export interface ITomorrow extends IForecast{

}

export interface ITomorrowModel extends ITomorrow, Document {

}

export default mongoose.model<ITomorrowModel>('TomorrowApi', ForecastSchema);
