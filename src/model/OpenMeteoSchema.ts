import {ForecastSchema, IForecast} from "./Forecast";
import mongoose from "mongoose";

export interface IOpenMeteo extends IForecast{

}

export interface IOpenMeteoModel extends IOpenMeteo, Document {

}

export default mongoose.model<IOpenMeteoModel>('meteoweathers', ForecastSchema);
