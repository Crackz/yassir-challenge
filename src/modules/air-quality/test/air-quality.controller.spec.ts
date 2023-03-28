import { Test } from '@nestjs/testing';
import { AirQualityController } from '../air-quality.controller';
import { AirQualityService } from '../air-quality.service';
import { FindAirQualityDto } from '../dtos/find-air-quality.dto';
import { getFindAirQualityResponseDtoStub } from './stubs/find-air-quality-response-dto.stub';
import { getFindParisMostPollutionDateStub } from './stubs/find-paris-most-pollution-date.stub';

jest.mock('../air-quality.service');

describe('AirController', () => {
    let airQualityController: AirQualityController;
    let airQualityService: AirQualityService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [AirQualityController],
            providers: [AirQualityService],
        }).compile();

        airQualityController = moduleRef.get<AirQualityController>(AirQualityController);
        airQualityService = moduleRef.get<AirQualityService>(AirQualityService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(airQualityController).toBeDefined();
    });

    describe('find', () => {
        const findAirQualityDto: FindAirQualityDto = { lat: 32, long: 32 };

        it('should call find in air quality service', async () => {
            await airQualityController.findAirQuality(findAirQualityDto);
            expect(airQualityService.find).toBeCalledWith(findAirQualityDto);
        });

        it('should return air quality response dto', async () => {
            const airQualityResponseDtoStub = getFindAirQualityResponseDtoStub();
            const airQualityResponseDto = await airQualityController.findAirQuality(
                findAirQualityDto,
            );
            expect(airQualityResponseDto).toEqual(airQualityResponseDtoStub);
        });
    });

    describe('findParisMostPollutionDate', () => {
        it('should call findParisMostPollutionDate in air quality service', async () => {
            await airQualityController.findParisMostPollutionDate();
            expect(airQualityService.findCityMostPollutionDate).toBeCalledWith('Paris');
        });

        it('should return most pollution date', async () => {
            const mostPollutionDate = await airQualityController.findParisMostPollutionDate();
            expect(mostPollutionDate).toEqual(getFindParisMostPollutionDateStub());
        });
    });
});
