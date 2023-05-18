export interface TomorrowApiResponse {
    timelines: {
        hourly: TomorrowWeatherHour[];
    }
}

export interface TomorrowWeatherHour {
    time: string;
    values: {
        humidity: number;
        precipitationProbability: number;
        rainIntensity: number;
        temperature: number;
        temperatureApparent: number;
    };
}

