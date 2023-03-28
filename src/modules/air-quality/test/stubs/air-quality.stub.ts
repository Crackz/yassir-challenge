import { AirQuality } from '../../air-quality.entity';
import { getFindParisMostPollutionDateStub } from './find-paris-most-pollution-date.stub';

export function getAirQualityStub(): AirQuality {
    return {
        id: expect.any(Number),
        cityName: 'Paris',
        ts: new Date('2023-03-27T18:00:00.000Z'),
        aqius: 30,
        aqicn: 23,
        mainus: 'o3',
        maincn: 'o3',
        createdAt: getFindParisMostPollutionDateStub(),
        updatedAt: getFindParisMostPollutionDateStub(),
    };
}
