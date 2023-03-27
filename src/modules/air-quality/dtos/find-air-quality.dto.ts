import { IsDefined, IsLatitude, IsLongitude, IsString } from 'class-validator';

export class FindAirQualityDto {
    /**
     * Latitude numerical value, within range [-90, 90].
     */
    @IsDefined()
    @IsString()
    @IsLatitude()
    lat: string;

    /**
     * Longitude numerical value, within range [-180, 180].
     */
    @IsDefined()
    @IsString()
    @IsLongitude()
    long: string;
}
