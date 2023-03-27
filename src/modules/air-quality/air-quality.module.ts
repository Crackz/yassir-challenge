import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirQualityController } from './air-quality.controller';
import { AirQuality } from './air-quality.entity';
import { AirQualityService } from './air-quality.service';

@Module({
    imports: [TypeOrmModule.forFeature([AirQuality])],
    controllers: [AirQualityController],
    providers: [AirQualityService],
})
export class AirQualityModule {}
