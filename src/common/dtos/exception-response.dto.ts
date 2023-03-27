import { ValidationError } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ExceptionResponse {
    status: string;
    statusCode: number;
    message: string;
}

export class UnprocessableExceptionResponse {
    status: string;
    @ApiProperty({
        default: 422,
    })
    statusCode: 422;
    message: UnprocessableExceptionMessageResponse[];
}

export class UnprocessableExceptionMessageResponse {
    /**
     * Object that was validated.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.target option
     */
    target?: object;
    /**
     * Object's property that haven't pass validation.
     */
    property: string;
    /**
     * Value that haven't pass a validation.
     *
     * OPTIONAL - configurable via the ValidatorOptions.validationError.value option
     */
    value?: any;
    /**
     * Constraints that failed validation with error messages.
     */
    constraints?: {
        [type: string]: string;
    };
    /**
     * Contains all nested validation errors of the property.
     */
    children?: ValidationError[];
    contexts?: {
        [type: string]: any;
    };
}
