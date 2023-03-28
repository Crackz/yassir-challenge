import { getFindAirQualityResponseDtoStub } from '../test/stubs/find-air-quality-response-dto.stub';
import { getFindParisMostPollutionDateStub } from '../test/stubs/find-paris-most-pollution-date.stub';

export const AirQualityService = jest.fn().mockReturnValue({
    find: jest.fn().mockResolvedValue(getFindAirQualityResponseDtoStub()),
    findCityMostPollutionDate: jest.fn().mockResolvedValue(getFindParisMostPollutionDateStub()),
});
