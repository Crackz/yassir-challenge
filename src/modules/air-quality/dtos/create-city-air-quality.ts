import { IsDefined, IsNumber, IsString } from 'class-validator';

export class CreateCityAirQualityDto {
    @IsString()
    @IsDefined()
    cityName: string;

    @IsString()
    @IsDefined()
    ts: string;

    /**
     * Pollution Level The Higher The Worse
     */
    @IsNumber()
    @IsDefined()
    aqius: number;

    @IsNumber()
    @IsDefined()
    aqicn: number;

    @IsString()
    @IsDefined()
    mainus: string;

    @IsString()
    @IsDefined()
    maincn: string;
}
