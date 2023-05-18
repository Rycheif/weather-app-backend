import axios from "axios";
import {config} from "../config/config";
import {TomorrowApiResponse} from "../model/responses/TomorrowApiResponse";
import {VisualCrossingApiResponse} from "../model/responses/VisualCrossingApiResponse";
import {OpenMeteoApiResponse} from "../model/responses/OpenMeteoApiResponse";

async function getForecastFromTomorrowApi() {
    const {data} = await axios.get<TomorrowApiResponse>(
        config.apis.tomorrow,
        {
            headers: {
                Accept: 'application/json',
            }
        });

    return data;
}

async function getForecastFromVisualCrossingApi() {
    const {data} = await axios.get<VisualCrossingApiResponse>(
        config.apis.visualCrossing,
        {
            headers: {
                Accept: 'application/json',
            }
        });

    return data;
}

async function getForecastFromOpenMeteoApi() {
    const {data} = await axios.get<OpenMeteoApiResponse>(
        config.apis.meteo,
        {
            headers: {
                Accept: 'application/json',
            }
        });

    return data;
}

async function getForecastWithRetry<T>(
    tries: number,
    delay: number,
    fetchForecast: () => Promise<T>): Promise<T> {

    try {
        return await fetchForecast();
    } catch (error) {
        console.warn(`Retry failed. ${tries} left`);
        if (tries < 1) {
            console.error(`All retries failed`);
            throw error;
        }

        await wait(delay);
        return getForecastWithRetry(tries - 1, delay, fetchForecast);
    }

}

function wait(delay: number) {
    return new Promise<void>(resolve => setTimeout(resolve, delay));
}

export default {
    getForecastFromTomorrowApi,
    getForecastFromOpenMeteoApi,
    getForecastFromVisualCrossingApi,
    getForecastWithRetry
};
