import { Controller, Get, Query } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import {
    ExceptionResponse,
    UnprocessableExceptionResponse,
} from 'src/common/dtos/exception-response.dto';
import { AirQualityService } from './air-quality.service';
import { FindAirQualityResponseDto } from './dtos/find-air-quality-response.dto';
import { FindAirQualityDto } from './dtos/find-air-quality.dto';
import { FindCityMostPollutionDto } from './dtos/find-city-most-pollution.dto';

@Controller('air-quality')
export class AirQualityController {
    constructor(private readonly airQualityService: AirQualityService) {}

    @ApiOkResponse({ type: FindAirQualityResponseDto })
    @ApiUnprocessableEntityResponse({ type: UnprocessableExceptionResponse })
    @ApiBadRequestResponse({
        type: ExceptionResponse,
        description: `Could not find air quality for lat: {lat}, long: {long}`,
    })
    @Get()
    async findAirQuality(
        @Query() findAirQualityDto: FindAirQualityDto,
    ): Promise<FindAirQualityResponseDto> {
        return await this.airQualityService.find(findAirQualityDto);
    }

    @ApiOkResponse({ type: FindCityMostPollutionDto })
    @ApiBadRequestResponse({
        type: ExceptionResponse,
        description: `Couldn't find a city: {cityName} pollution data`,
    })
    @Get('/paris/most-pollution')
    async findParisMostPollutionDate(): Promise<FindCityMostPollutionDto> {
        return await this.airQualityService.findCityMostPollutionDate('Paris');
    }
}
