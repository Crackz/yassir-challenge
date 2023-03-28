import {
    IQAIRNearestCityFailResponse,
    IQAIRNearestCitySuccessResponse,
} from '../../interfaces/iqair-nearest-city-response';
import { getFindAirQualityResponseDtoStub } from './find-air-quality-response-dto.stub';

export function getNearestCityAirQualitySuccessStub(): IQAIRNearestCitySuccessResponse {
    return {
        status: 'success',
        data: {
            current: {
                pollution: {
                    ...getFindAirQualityResponseDtoStub().Result.Pollution,
                },
            },
        },
    };
}

export function getNearestCityAirQualityFailStub(): IQAIRNearestCityFailResponse {
    return {
        status: 'fail',
        data: {
            message: 'city_not_found',
        },
    };
}
