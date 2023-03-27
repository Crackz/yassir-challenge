import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { EnvironmentVariables } from './common/env/environment-variables';
import { validateEnvironmentVariables } from './common/env/validation';
import { PostgresConfigurationReader } from './common/utils/postgres-config-reader';
import { AirQualityModule } from './modules/air-quality/air-quality.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [path.join(__dirname, `../env/.${process.env.NODE_ENV}.env`)],
            validate: validateEnvironmentVariables,
        }),
        TypeOrmModule.forRootAsync({
            useFactory: (configService: ConfigService<EnvironmentVariables>) => {
                const dbConfigurationReader = new PostgresConfigurationReader({
                    name: configService.get('DB_NAME'),
                    host: configService.get('DB_HOST'),
                    username: configService.get('DB_USER'),
                    password: configService.get('DB_PASSWORD'),
                });

                return dbConfigurationReader.getConnectionOptions();
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        AirQualityModule,
    ],
})
export class AppModule {}
