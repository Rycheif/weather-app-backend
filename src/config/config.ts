import dotenv from 'dotenv';

dotenv.config();

const MONGO_USERNAME = process.env.MONGO_USERNAME || 'bababoj';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || 'mongoł123';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@firebreathingsoultormen.uahia5c.mongodb.net/weather-app`;

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const METEO_WEATHER_API = `https://api.open-meteo.com/v1/forecast?latitude=50.01&longitude=20.99&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth&timezone=Europe%2FBerlin`;
const TOMORROW_API = `https://api.tomorrow.io/v4/weather/forecast?location=tarnow&apikey=1rSfIiVvLlXDcIgU7vdEuh2MKLNUAVCp`;
const VISUAL_CROSSING_WEATHER_API = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Tarnow?unitGroup=metric&include=hours&key=WUUB5CLKC97FSMXZ6YK8GF4F6&contentType=json`;

const FETCH_RETRIES = 3;
const RETRY_DELAY = 3000;

const RUN_ON = '5 20 * * *';

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    },
    apis: {
        meteo: METEO_WEATHER_API,
        tomorrow: TOMORROW_API,
        visualCrossing: VISUAL_CROSSING_WEATHER_API
    },
    nodeCronConfig: {
        runOn: RUN_ON
    },
    fetchingConfig: {
        fetchRetries: FETCH_RETRIES,
        retryDelay: RETRY_DELAY
    }
}
