import {
    ArgumentMetadata,
    UnprocessableEntityException,
    ValidationError,
    ValidationPipe,
    ValidationPipeOptions,
} from '@nestjs/common';

export class DefaultValidationPipe extends ValidationPipe {
    constructor(overwriteDefaultOptions: ValidationPipeOptions = {}) {
        super({
            transform: true,
            forbidUnknownValues: true,
            whitelist: true,
            validationError: { target: false },
            transformOptions: { enableImplicitConversion: true },
            exceptionFactory: (errors: ValidationError[]) => {
                return new UnprocessableEntityException(errors);
            },
            ...overwriteDefaultOptions,
        });
    }

    async transform(value: any, metadata: ArgumentMetadata): Promise<void> {
        if (metadata.metatype && (metadata.metatype as any).transformer) {
            value = (metadata.metatype as any).transformer(value);
        }

        return await super.transform(value, metadata);
    }
}
