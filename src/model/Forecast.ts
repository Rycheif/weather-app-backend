import {Schema} from "mongoose";

export interface IForecast {
    forecastFrom: string; // date
    time: string; // datetime
    temperature: number; // Celsius
    feelsLike: number; // Celsius
    rain: number; // mm
    precipitationProbability: number; // %
    humidity: number; // %
    source: string;
}

export const ForecastSchema: Schema = new Schema({
    forecastFrom: {type: String, required: true},
    time: {type: String, required: true},
    temperature: {type: Number, required: true},
    feelsLike: {type: Number, required: true},
    rain: {type: Number, required: true},
    precipitationProbability: {type: Number, required: true},
    humidity: {type: Number, required: true},
    forecastSource: {type: String, required: true}
});

