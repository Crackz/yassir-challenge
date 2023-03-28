import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { EnvironmentVariables } from 'src/common/env/environment-variables';
import { Repository } from 'typeorm';
import { AirQuality } from './air-quality.entity';
import { CreateCityAirQualityDto } from './dtos/create-city-air-quality';
import { FindAirQualityResponseDto } from './dtos/find-air-quality-response.dto';
import { FindAirQualityDto } from './dtos/find-air-quality.dto';
import { FindCityMostPollutionDto } from './dtos/find-city-most-pollution.dto';
import {
    IQAIRNearestCityResponse,
    IQAIRNearestCitySuccessResponse,
} from './interfaces/iqair-nearest-city-response';

@Injectable()
export class AirQualityService {
    private logger = new Logger('Air Quality');
    private nearestCityURL: string;
    private iqAirAccessKey: string;
    private parisCoordinates = {
        lat: 48.856613,
        long: 2.352222,
    };

    constructor(
        private readonly configService: ConfigService<EnvironmentVariables>,
        @InjectRepository(AirQuality) private readonly airQualityRepository: Repository<AirQuality>,
    ) {
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

    async create(createCityPollutionDto: CreateCityAirQualityDto): Promise<void> {
        await this.airQualityRepository.insert(createCityPollutionDto);
    }

    async findCityMostPollutionDate(cityName: string): Promise<FindCityMostPollutionDto> {
        const [airQuality] = await this.airQualityRepository.find({
            where: {
                cityName,
            },
            order: {
                aqius: 'DESC',
                createdAt: 'DESC',
            },
            take: 1,
        });

        if (!airQuality) {
            throw new BadRequestException(`Couldn't find a city: ${cityName} pollution data`);
        }

        return {
            mostPollutionDate: airQuality.createdAt,
        };
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async findParisAirQualityEveryMinute() {
        this.logger.debug('CRON IS STARTED');
        const parisAirQuality = await this.find(this.parisCoordinates);
        this.logger.debug('Adding: ', parisAirQuality);
        await this.create({
            ...parisAirQuality.Result.Pollution,
            cityName: 'Paris',
        });
    }
}
