import { AppContainer } from './app';
import { Logger } from '@nestjs/common';
import { NodeEnvironment } from './common/constants';

const appLogger = new Logger('App');

appLogger.verbose(`Node Environment: ${process.env.NODE_ENV}`);
appLogger.verbose(`Node Version: ${process.version}`);

if (process.env.NODE_ENV === NodeEnvironment.DEVELOPMENT) {
    appLogger.verbose(`Node Pid: ${process.pid}`);
}

new AppContainer().start(appLogger);
