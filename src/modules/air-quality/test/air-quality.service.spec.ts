import { BadRequestException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import MockAxiosAdapter from 'axios-mock-adapter';
import { Repository } from 'typeorm';
import { AirQuality } from '../air-quality.entity';
import { AirQualityService } from '../air-quality.service';
import { FindAirQualityDto } from '../dtos/find-air-quality.dto';
import { getAirQualityStub } from './stubs/air-quality.stub';
import { getFindAirQualityResponseDtoStub } from './stubs/find-air-quality-response-dto.stub';
import {
    getNearestCityAirQualityFailStub,
    getNearestCityAirQualitySuccessStub,
} from './stubs/get-nearest-city-air-quality.stub';

describe('AirQualityService', () => {
    let service: AirQualityService;
    let repo: Repository<AirQuality>;
    let mockAxios: MockAxiosAdapter;
    const iqairAccessKey = 'placeholder-access-key';
    const iqairNearestCityUrl = '/nearest-city';

    beforeAll(() => {
        mockAxios = new MockAxiosAdapter(axios);
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AirQualityService,
                {
                    provide: getRepositoryToken(AirQuality),
                    useValue: {
                        find: jest.fn().mockImplementation((filterQuery) => {
                            if (filterQuery && filterQuery.where?.cityName === 'Paris') {
                                return Promise.resolve([getAirQualityStub()]);
                            }
                            return Promise.resolve([]);
                        }),
                        insert: jest.fn().mockResolvedValue({}),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key) => {
                            if (key === 'IQAIR_ACCESS_KEY') return iqairAccessKey;
                            if (key === 'IQAIR_NEAREST_CITY_URL') return iqairNearestCityUrl;

                            return key;
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AirQualityService>(AirQualityService);
        repo = module.get<Repository<AirQuality>>(getRepositoryToken(AirQuality));

        mockAxios.reset();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('find', () => {
        const findAirQualityDto: FindAirQualityDto = { lat: 32, long: 32 };

        it('should return find air quality response dto', async () => {
            mockAxios
                .onGet(iqairNearestCityUrl)
                .reply(HttpStatus.OK, getNearestCityAirQualitySuccessStub());
            const findAirQualityResponseDto = await service.find(findAirQualityDto);
            expect(findAirQualityResponseDto).toEqual(getFindAirQualityResponseDtoStub());
        });

        it('should throw bad request if iqair returned any error', async () => {
            mockAxios
                .onGet(iqairNearestCityUrl)
                .reply(HttpStatus.BAD_REQUEST, getNearestCityAirQualityFailStub());
            await expect(service.find(findAirQualityDto)).rejects.toThrowError(BadRequestException);
        });

        it('should throw internal server error if any expected error occurred', async () => {
            mockAxios.onGet(iqairNearestCityUrl).networkError();
            await expect(service.find(findAirQualityDto)).rejects.toThrowError(
                InternalServerErrorException,
            );
        });
    });

    describe('create', () => {
        it('should create air quality', async () => {
            const createDto = {
                cityName: 'paris',
                ts: '2023-03-27T18:00:00.000Z',
                aqius: getAirQualityStub().aqius,
                aqicn: getAirQualityStub().aqicn,
                mainus: getAirQualityStub().mainus,
                maincn: getAirQualityStub().maincn,
            };
            await service.create(createDto);
            expect(repo.insert).toBeCalledWith(createDto);
        });
    });

    describe('findCityMostPollutionDate', () => {
        it('should return most pollution date when city name is right', async () => {
            const cityMostPollutionDto = await service.findCityMostPollutionDate('Paris');
            expect(cityMostPollutionDto.mostPollutionDate).toEqual(getAirQualityStub().createdAt);
        });

        it('should throw bad request error if unknown city name is passed', async () => {
            await expect(
                service.findCityMostPollutionDate('unknown_city_name'),
            ).rejects.toThrowError(BadRequestException);
        });
    });

    describe('findParisAirQualityEveryMinute', () => {
        it('should call find then create air quality', async () => {
            mockAxios
                .onGet(iqairNearestCityUrl)
                .reply(HttpStatus.OK, getNearestCityAirQualitySuccessStub());
            await service.findParisAirQualityEveryMinute();
            expect(repo.insert).toBeCalledWith({
                ...getFindAirQualityResponseDtoStub().Result.Pollution,
                cityName: expect.any(String),
            });
        });

        it('should throw internal server error if any expected error occurred', async () => {
            mockAxios.onGet(iqairNearestCityUrl).networkError();
            await expect(service.findParisAirQualityEveryMinute()).rejects.toThrowError();
            expect(repo.insert).not.toBeCalled();
        });
    });
});
