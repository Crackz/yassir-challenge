export class FindAirQualityResponseDto {
    Result: {
        Pollution: {
            ts: string;
            aqius: number;
            aqicn: number;
            mainus: string;
            maincn: string;
        };
    };
}
