import { HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import {
  AppException,
  EAppExceptionCode,
} from 'src/shared/exceptions/app.exception';


export const VALIDATION_PIPE_OPTIONS = {
  transform: true,
  whitelist: true,
  exceptionFactory: (
    validationErrors: ValidationError[] = [],
  ): AppException => {
    throw new AppException(
      EAppExceptionCode.BAD_REQUEST,
      'Bad request',
      HttpStatus.BAD_REQUEST,
      validationErrors.map((error) => {
        const errorMessage = error.constraints
          ? error.constraints
          : JSON.stringify(error);
        return {
          field: error.property,
          error: errorMessage,
        };
      }),
    );
  },
};
