import {OpenMeteoApiResponse} from "../src/model/responses/OpenMeteoApiResponse";
import {IForecast} from "../src/model/Forecast";
import {VisualCrossingApiResponse, VCWeatherHour} from "../src/model/responses/VisualCrossingApiResponse";
import {TomorrowApiResponse, TomorrowWeatherHour} from "../src/model/responses/TomorrowApiResponse";

function convertOpenMeteoResponse(response: OpenMeteoApiResponse, dateOfForecast: string) {
    const {hourly} = response;
    const forecasts: IForecast[] = [];

    for (let i = 0; i < hourly.rain.length; i++) {
        const forecast: IForecast = {
            forecastFrom: dateOfForecast,
            time: hourly.time[i],
            temperature: hourly.temperature_2m[i],
            feelsLike: hourly.apparent_temperature[i],
            rain: hourly.rain[i],
            precipitationProbability: hourly.precipitation_probability[i],
            humidity: hourly.relativehumidity_2m[i],
            source: "OpenMeteo"
        };

        forecasts.push(forecast);
    }

    return forecasts;
}

function convertVisualCrossingResponse(response: VisualCrossingApiResponse, dateOfForecast: string) {
    const {days} = response;
    let forecasts: IForecast[] = [];

    days.forEach(day => {
        const mappedHours = mapHoursVC(day, dateOfForecast);
        forecasts = forecasts.concat(mappedHours);
    });

    return forecasts;
}

function convertTomorrowResponse(response: TomorrowApiResponse, dateOfForecast: string) {
    const {hourly} = response.timelines;
    const forecasts: IForecast[] = [];

    hourly.forEach(hour => {
        const forecast: IForecast = {
            forecastFrom: dateOfForecast,
            time: hour.time,
            temperature: hour.values.temperature,
            feelsLike: hour.values.temperatureApparent,
            rain: hour.values.rainIntensity,
            precipitationProbability: hour.values.precipitationProbability,
            humidity: hour.values.humidity,
            source: "Tomorrow.io"
        };

        forecasts.push(forecast);
    });

    return forecasts;
}

function mapHoursVC(day: { datetime: string, hours: VCWeatherHour[] }, dateOfForecast: string) {
    return day.hours.map(hour => {
        const forecast: IForecast = {
            forecastFrom: dateOfForecast,
            time: `${day.datetime}T${hour.datetime}`,
            temperature: hour.temp,
            feelsLike: hour.feelslike,
            rain: hour.precip,
            precipitationProbability: hour.precipprob,
            humidity: hour.humidity,
            source: "VisualCrossing"
        };

        return forecast;
    });
}

export default {
    convertOpenMeteoResponse,
    convertVisualCrossingResponse,
    convertTomorrowResponse
};
