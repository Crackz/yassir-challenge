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
                const args = { param: [] as any, message: [] as any };
                this._transformErrors(errors, args);
                return new UnprocessableEntityException(args);
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

    private _transformErrors(
        errors: ValidationError[],
        args: { param: any[]; message: any[] },
        parentProperty = '',
    ) {
        for (const error of errors) {
            const property = parentProperty
                ? `${parentProperty}.${error.property}`
                : error.property;
            if (error.constraints) {
                args.message.push(error.constraints);
                args.param.push(property);
            }
            if (error.children && error.children.length > 0) {
                this._transformErrors(error.children, args, property);
            }
        }
    }
}
