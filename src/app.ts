import { INestApplication, Logger, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { NodeEnvironment } from './common/constants';
import { EnvironmentVariables } from './common/env/environment-variables';
import { DefaultValidationPipe } from './common/pipes/default-validation.pipe';
import { Swagger } from './common/utils/swagger';

export class AppContainer {
    public static initializePackages(app: INestApplication) {
        if (process.env.NODE_ENV !== 'production') Swagger.setup(app, { title: 'yassir Api' });
    }

    async start(appLogger?: Logger): Promise<void> {
        const logLevels: LogLevel[] = ['error', 'warn', 'verbose'];
        if (process.env.NODE_ENV !== NodeEnvironment.PRODUCTION) logLevels.push('debug');

        const app = await NestFactory.create<NestExpressApplication>(AppModule, {
            cors: true,
            logger: logLevels,
        });

        useContainer(app.select(AppModule), { fallbackOnErrors: true });

        const configService = app.get<ConfigService<EnvironmentVariables>>(ConfigService);

        app.setGlobalPrefix('v1');
        app.useGlobalPipes(new DefaultValidationPipe());

        AppContainer.initializePackages(app);
        app.use('/favicon.ico', (req, res) => res.status(204));

        const serverPort = configService.get<number>('SERVER_PORT');
        await app.listen(serverPort);

        if (appLogger) appLogger.verbose('Listening On Port: ' + serverPort);
    }
}
