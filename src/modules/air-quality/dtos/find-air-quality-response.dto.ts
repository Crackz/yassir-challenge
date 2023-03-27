export class FindAirQualityResponseDto {
    Result: {
        Pollution: {
            ts: string;
            aqius: string;
            aqicn: string;
            mainus: string;
            maincn: string;
        };
    };
}
