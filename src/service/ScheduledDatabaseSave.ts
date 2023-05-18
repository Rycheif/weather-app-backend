import FetchingForecast from "./FetchingForecast";
import TomorrowModel from "../model/TomorrwSchema";
import {config} from "../config/config";
import ApiResponseConverters from "../../util/ApiResponseConverters";
import mongoose from "mongoose";
import OpenMeteoModel from "../model/OpenMeteoSchema";
import VisualCrossingModel from "../model/VisualCrossingSchema";
import nodeCron from "node-cron";
import moment from "moment";

export default function scheduleDatabaseSave() {
    nodeCron.schedule(config.nodeCronConfig.runOn, saveForecast);
    console.log('Task scheduled');
}

async function saveForecast() {
    try {
        const dateOfForecast = moment().format("YYYY-MM-DDTHH:mm");
        const savingTomorrow = await isSaveNeededForTomorrow(dateOfForecast);
        const savingOpenMeteo = await isSaveNeededForOpenMeteo(dateOfForecast);
        const savingVisualCrossing = await isSaveNeededForVisualCrossing(dateOfForecast);

        if (savingTomorrow) {
            await saveTomorrowForecast(dateOfForecast);
        } else {
            console.log('Save for Tomorrow.io already done today.');
        }

        if (savingOpenMeteo) {
            await saveOpenMeteoForecast(dateOfForecast);
        } else {
            console.log('Save for OpenMeteo already done today.');
        }

        if (savingVisualCrossing) {
            await saveVisualCrossingForecast(dateOfForecast);
        } else {
            console.log('Save for VisualCrossing already done today.');
        }
    } catch (e: any | unknown) {
        console.error(e.message);
    }
}

async function isSaveNeededForTomorrow(dateOfForecast: string) {
    const doc = await TomorrowModel.findOne()
        .sort({$natural: -1})
        .exec();

    if (null !== doc) {
        return moment(dateOfForecast).diff(moment(doc.forecastFrom), "days") > 0;
    }

    return true;
}

async function isSaveNeededForOpenMeteo(dateOfForecast: string) {
    const doc = await OpenMeteoModel.findOne()
        .sort({$natural: -1})
        .exec();

    if (null !== doc) {
        return moment(dateOfForecast).diff(moment(doc.forecastFrom), "days") > 0;
    }

    return true;
}

async function isSaveNeededForVisualCrossing(dateOfForecast: string) {
    const doc = await OpenMeteoModel.findOne()
        .sort({$natural: -1})
        .exec();

    if (null !== doc) {
        return moment(dateOfForecast).diff(moment(doc.forecastFrom), "days") > 0;
    }

    return true;
}

async function saveTomorrowForecast(forecastFrom: string) {
    const {fetchingConfig} = config;
    const tomorrowResponse = await FetchingForecast.getForecastWithRetry(
        fetchingConfig.fetchRetries,
        fetchingConfig.retryDelay,
        FetchingForecast.getForecastFromTomorrowApi);

    const forecasts = ApiResponseConverters.convertTomorrowResponse(tomorrowResponse, forecastFrom)
        .map(forecast => {
            const {
                time,
                temperature,
                feelsLike,
                rain,
                precipitationProbability,
                humidity,
                source
            } = forecast;
            return new TomorrowModel({
                _id: new mongoose.Types.ObjectId,
                forecastFrom,
                time,
                temperature,
                feelsLike,
                rain,
                precipitationProbability,
                humidity,
                source,
                forecastSource: "Tomorrow.io"
            });
        });

    await TomorrowModel.bulkSave(forecasts);
    console.log('Forecast from Tommorow.io saved');
}

async function saveOpenMeteoForecast(forecastFrom: string) {
    const {fetchingConfig} = config;
    const openMeteoResponse = await FetchingForecast.getForecastWithRetry(
        fetchingConfig.fetchRetries,
        fetchingConfig.retryDelay,
        FetchingForecast.getForecastFromOpenMeteoApi);

    const forecasts = ApiResponseConverters.convertOpenMeteoResponse(openMeteoResponse, forecastFrom)
        .map(forecast => {
            const {
                time,
                temperature,
                feelsLike,
                rain,
                precipitationProbability,
                humidity,
                source
            } = forecast;
            return new OpenMeteoModel({
                _id: new mongoose.Types.ObjectId,
                forecastFrom,
                time,
                temperature,
                feelsLike,
                rain,
                precipitationProbability,
                humidity,
                source,
                forecastSource: "OpenMeteo"
            });
        });

    await OpenMeteoModel.bulkSave(forecasts);
    console.log('Forecast from OpenMeteo saved');
}

async function saveVisualCrossingForecast(forecastFrom: string) {
    const {fetchingConfig} = config;
    const visualCrossingResponse = await FetchingForecast.getForecastWithRetry(
        fetchingConfig.fetchRetries,
        fetchingConfig.retryDelay,
        FetchingForecast.getForecastFromVisualCrossingApi);

    const forecasts = ApiResponseConverters.convertVisualCrossingResponse(visualCrossingResponse, forecastFrom)
        .map(forecast => {
            const {
                time,
                temperature,
                feelsLike,
                rain,
                precipitationProbability,
                humidity,
                source
            } = forecast;
            return new VisualCrossingModel({
                _id: new mongoose.Types.ObjectId,
                forecastFrom,
                time,
                temperature,
                feelsLike,
                rain,
                precipitationProbability,
                humidity,
                source,
                forecastSource: "VisualCrossing"
            });
        });

    await VisualCrossingModel.bulkSave(forecasts);
    console.log('Forecast from VisualCrossing saved');
}

