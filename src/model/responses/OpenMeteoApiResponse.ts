export interface OpenMeteoApiResponse {
    hourly: {
        time: string[];
        temperature_2m: number[];
        relativehumidity_2m: number[];
        apparent_temperature: number[];
        precipitation: number[];
        precipitation_probability: number[];
        rain: number[];
        showers: number[];
        snowfall: number[];
        snow_depth: number[];
    };
}
