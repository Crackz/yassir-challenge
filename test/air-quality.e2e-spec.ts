import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import axios from 'axios';
import MockAxiosAdapter from 'axios-mock-adapter';
import { DefaultValidationPipe } from 'src/common/pipes/default-validation.pipe';
import { AirQuality } from 'src/modules/air-quality/air-quality.entity';
import { AirQualityModule } from 'src/modules/air-quality/air-quality.module';
import { getAirQualityStub } from 'src/modules/air-quality/test/stubs/air-quality.stub';
import { getFindAirQualityResponseDtoStub } from 'src/modules/air-quality/test/stubs/find-air-quality-response-dto.stub';
import {
    getNearestCityAirQualityFailStub,
    getNearestCityAirQualitySuccessStub,
} from 'src/modules/air-quality/test/stubs/get-nearest-city-air-quality.stub';
import * as request from 'supertest';

describe('AppController (e2e)', () => {
    let app: INestApplication;
    let mockAxios: MockAxiosAdapter;
    const iqairAccessKey = 'placeholder-access-key';
    const iqairNearestCityUrl = '/nearest-city';
    const mockAirQualityRepository = {
        find: jest.fn(),
    };

    beforeAll(() => {
        mockAxios = new MockAxiosAdapter(axios);
    });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AirQualityModule, ConfigModule.forRoot({ isGlobal: true })],
        })
            .overrideProvider(getRepositoryToken(AirQuality))
            .useValue(mockAirQualityRepository)
            .overrideProvider(ConfigService)
            .useValue({
                get: jest.fn().mockImplementation((key) => {
                    if (key === 'IQAIR_ACCESS_KEY') return iqairAccessKey;
                    if (key === 'IQAIR_NEAREST_CITY_URL') return iqairNearestCityUrl;

                    return key;
                }),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new DefaultValidationPipe());

        await app.init();
        mockAxios.reset();
        jest.clearAllMocks();
    });

    describe('/air-quality (GET)', () => {
        it('should fail when there no query string are passed', async () => {
            const res = await request(app.getHttpServer()).get('/air-quality').expect(422);
            expect(res.body).toEqual({
                statusCode: 422,
                message: expect.any(Array),
                error: 'Unprocessable Entity',
            });
        });

        it.each([undefined, [], true, 100, -100])('should fail when lat is %s', async (lat) => {
            const query = { lat, long: 32 };

            const res = await request(app.getHttpServer())
                .get('/air-quality')
                .query(query)
                .expect(422);
            expect(res.body).toEqual({
                statusCode: 422,
                message: expect.any(Array),
                error: 'Unprocessable Entity',
            });
        });

        it.each([undefined, [], true, 200, -200])('should fail when long is %s', async (long) => {
            const query = { lat: 32, long };

            const res = await request(app.getHttpServer())
                .get('/air-quality')
                .query(query)
                .expect(422);
            expect(res.body).toEqual({
                statusCode: 422,
                message: expect.any(Array),
                error: 'Unprocessable Entity',
            });
        });

        it('should return bad request when iqair fails', async () => {
            mockAxios
                .onGet(iqairNearestCityUrl)
                .reply(HttpStatus.BAD_REQUEST, getNearestCityAirQualityFailStub());

            const query = { lat: 32, long: 32 };
            const res = await request(app.getHttpServer())
                .get('/air-quality')
                .query(query)
                .expect(400);

            expect(res.body).toEqual({
                statusCode: 400,
                message: expect.any(String),
                error: 'Bad Request',
            });
        });

        it('should return internal server when unhandled error happens', async () => {
            mockAxios.onGet(iqairNearestCityUrl).networkError();

            const query = { lat: 32, long: 32 };
            await request(app.getHttpServer()).get('/air-quality').query(query).expect(500);
        });

        it('should return find air quality response dto', async () => {
            mockAxios
                .onGet(iqairNearestCityUrl)
                .reply(HttpStatus.OK, getNearestCityAirQualitySuccessStub());

            const query = { lat: 32, long: 32 };
            const res = await request(app.getHttpServer())
                .get('/air-quality')
                .query(query)
                .expect(200);
            expect(res.body).toEqual(getFindAirQualityResponseDtoStub());
        });
    });

    describe('/air-quality/paris/most-pollution (GET)', () => {
        it('should fail when city name is not correct or no data is inserted by cron job', async () => {
            mockAirQualityRepository.find = jest.fn().mockResolvedValue([]);

            const res = await request(app.getHttpServer())
                .get('/air-quality/paris/most-pollution')
                .expect(400);
            expect(res.body).toEqual({
                statusCode: 400,
                message: expect.any(String),
                error: 'Bad Request',
            });
        });

        it('should return city most pollution dto', async () => {
            mockAirQualityRepository.find = jest.fn().mockResolvedValue([getAirQualityStub()]);

            const res = await request(app.getHttpServer())
                .get('/air-quality/paris/most-pollution')
                .expect(200);
            expect(res.body).toEqual({
                mostPollutionDate: getAirQualityStub().createdAt.toISOString(),
            });
        });
    });
});
