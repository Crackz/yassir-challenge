import { Logger } from '@nestjs/common';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { NodeEnvironment } from '../constants';
import { PostgresDbConfig } from '../interfaces/postgres-config-reader.interface';

export class PostgresConfigurationReader {
    private _logger = new Logger('Db');

    constructor(private _dbConfig: PostgresDbConfig) {}

    getConnectionOptions(): PostgresConnectionOptions {
        const shouldSynchronize = process.env.NODE_ENV !== NodeEnvironment.PRODUCTION;

        return {
            type: 'postgres',
            entities: ['dist/**/*.entity.js'],
            synchronize: shouldSynchronize,
            ...this._dbConfig,
        };
    }

    log(message: string, ...optionalParams: any[]) {
        this._logger.verbose(message, ...optionalParams);
    }
}
