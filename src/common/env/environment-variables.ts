import { IsDefined, IsEnum, IsNumber, IsString } from 'class-validator';
import { NodeEnvironment } from '../constants';

export class EnvironmentVariables {
    // External Environment Variables

    @IsDefined()
    @IsEnum(NodeEnvironment)
    NODE_ENV: NodeEnvironment;

    // Server

    @IsDefined()
    @IsNumber()
    SERVER_PORT: number;

    // DB

    @IsDefined()
    @IsString()
    DB_NAME: string;

    @IsDefined()
    @IsString()
    DB_HOST: string;

    @IsDefined()
    @IsString()
    DB_USER: string;

    @IsDefined()
    @IsString()
    DB_PASSWORD: string;

    @IsDefined()
    @IsString()
    IQAIR_ACCESS_KEY: string;

    @IsDefined()
    @IsString()
    IQAIR_NEAREST_CITY_URL: string;
}
