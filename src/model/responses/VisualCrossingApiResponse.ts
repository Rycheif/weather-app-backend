export interface VisualCrossingApiResponse {
    days: Array<{
        datetime: string;
        hours: VCWeatherHour[];
    }>;
}

export interface VCWeatherHour {
    datetime: string;
    temp: number;
    feelslike: number;
    dew: number;
    humidity: number;
    precip: number;
    precipprob: number;
    snow: number;
    snowdepth: number;
    pressure: number;
    windspeed: number;
    cloudcover: number;
    visibility: number;
    conditions: string;
    description: string;
}
