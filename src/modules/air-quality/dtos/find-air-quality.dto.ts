import { IsDefined, IsLatitude, IsLongitude, IsNumber } from 'class-validator';

export class FindAirQualityDto {
    /**
     * Latitude numerical value, within range [-90, 90].
     */
    @IsDefined()
    @IsNumber()
    @IsLatitude()
    lat: number;

    /**
     * Longitude numerical value, within range [-180, 180].
     */
    @IsDefined()
    @IsNumber()
    @IsLongitude()
    long: number;
}
