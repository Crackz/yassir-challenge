import { IsDefined, IsString } from 'class-validator';

export class CreateCityAirQualityDto {
    @IsString()
    @IsDefined()
    cityName: string;

    /**
     * Pollution Level The Higher The Worse
     */
    @IsString()
    @IsDefined()
    aqius: string;

    @IsString()
    @IsDefined()
    ts: string;

    @IsString()
    @IsDefined()
    aqicn: string;

    @IsString()
    @IsDefined()
    mainus: string;

    @IsString()
    @IsDefined()
    maincn: string;
}
