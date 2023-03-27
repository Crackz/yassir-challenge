import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { EnvironmentVariables } from 'src/common/env/environment-variables';
import { FindAirQualityResponseDto } from './dtos/find-air-quality-response.dto';
import { FindAirQualityDto } from './dtos/find-air-quality.dto';
import {
    IQAIRNearestCityResponse,
    IQAIRNearestCitySuccessResponse,
} from './interfaces/iqair-nearest-city-response';

@Injectable()
export class AirQualityService {
    private nearestCityURL: string;
    private iqAirAccessKey: string;

    constructor(private readonly configService: ConfigService<EnvironmentVariables>) {
        this.nearestCityURL = this.configService.get('IQAIR_NEAREST_CITY_URL');
        this.iqAirAccessKey = this.configService.get('IQAIR_ACCESS_KEY');
    }

    async find(findAirQualityDto: FindAirQualityDto): Promise<FindAirQualityResponseDto> {
        try {
            const { data } = await axios.get<IQAIRNearestCityResponse>(this.nearestCityURL, {
                params: {
                    lat: findAirQualityDto.lat,
                    lon: findAirQualityDto.long,
                    key: this.iqAirAccessKey,
                },
            });

            return {
                Result: {
                    Pollution: (data as IQAIRNearestCitySuccessResponse).data.current.pollution,
                },
            };
        } catch (err) {
            if (err.response && err.response.status === 400) {
                throw new BadRequestException(
                    `Could not find air quality for lat: ${findAirQualityDto.lat}, long: ${findAirQualityDto.long}`,
                );
            }

            throw new InternalServerErrorException(err);
        }
    }
}
