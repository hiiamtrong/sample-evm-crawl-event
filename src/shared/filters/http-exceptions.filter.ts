import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppConfigService } from 'src/modules/configs/config.service';
import {
  AppException,
  EAppExceptionCode,
} from 'src/shared/exceptions/app.exception';


@Catch()
export class HttpExceptionsFilter<T> implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionsFilter.name);
  constructor(
    private config: AppConfigService,

  ) {
  }

  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req: Request = ctx.getRequest<Request>();
    const res: Response = ctx.getResponse<Response>();
    const acceptedLanguage = req.headers['accept-language'];
    const path = req.url;
    const timestamp = new Date().toISOString();

    let stack: unknown;
    let statusCode: HttpStatus;
    let message: string;
    let details: string | object;
    let code: EAppExceptionCode;
    // TODO : Based on language value in header, return a localized message.
    let localizedMessage: string;
    // TODO : Refactor the below cases into a switch case and tidy up error response creation.
    if (exception instanceof AppException) {
      statusCode = exception.getStatus();
      message = exception.message;
      code = exception.code;
      localizedMessage = exception.localizedMessage
        ? exception.localizedMessage[acceptedLanguage]
        : '';
      details = exception.details || exception.getResponse();
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
      details = exception.getResponse();
      code = EAppExceptionCode.INTERNAL_SERVER_ERROR;
    } else if (exception instanceof Error) {
      message = exception.message;
      stack = exception.stack;
      code = EAppExceptionCode.INTERNAL_SERVER_ERROR;
    }

    // Set to internal server error in case it did not match above categories.
    statusCode = statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    message = message || 'Internal server error';

    // NOTE: For reference, please check https://cloud.google.com/apis/design/errors
    const error = {
      statusCode,
      message,
      localizedMessage,
      details,
      code,
      // Additional meta added by us.
    };
    this.logger.warn(error.message, {
      error,
      stack,
    });

    // Suppress original internal server error details in prod mode
    const isProMood = this.config.app.env !== 'development';
    if (isProMood && statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      error.message = 'Internal server error';
    }

    res.status(statusCode).json({
      error,
      meta: {
        path,
        timestamp,
      },
    });
  }
}
