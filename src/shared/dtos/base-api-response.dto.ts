import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EAppExceptionCode } from 'src/shared/exceptions/app.exception';


export class PaginationResponseDto<T> {
  @Expose()
  @ApiProperty({ type: [Object] })
  public data: T[];

  @Expose()
  @ApiProperty({ type: Number })
  public total: number;

  @Expose()
  @ApiProperty({ type: Number })
  public page: number;
}

export class PaginationMeta {
  @ApiProperty({ type: Number })
  public total: number;

  @ApiProperty({ type: Number })
  public page: number;
}

export class BaseApiResponseMeta {
  @ApiProperty({ type: String, example: 'GET /api/v1/abc' })
  public path: string;

  @ApiProperty({ type: String, example: '2024-02-20T08:00:00.000Z' })
  public timestamp: string;
}
export class BaseApiResponse<T> {
  @ApiProperty({ type: Object })
  public data: T;

  @ApiProperty({ type: Object })
  public meta: BaseApiResponseMeta;

  @ApiProperty({ type: PaginationMeta })
  public pagination?: PaginationMeta;
}

export function SwaggerBaseApiResponse<T>(type: T): typeof BaseApiResponse {
  class ExtendedBaseApiResponse<T> extends BaseApiResponse<T> {
    @ApiProperty({ type })
    public data: T;

    @ApiProperty({ type: BaseApiResponseMeta })
    public meta: BaseApiResponseMeta;

    @ApiProperty({ type: PaginationMeta })
    public pagination?: PaginationMeta;
  }


  // NOTE : Overwrite the returned class name, otherwise whichever type calls this function in the last,
  // will overwrite all previous definitions. i.e., Swagger will have all response types as the same one.
  const isAnArray = Array.isArray(type) ? ' [ ] ' : '';
  Object.defineProperty(ExtendedBaseApiResponse, 'name', {
    value: `SwaggerBaseApiResponseFor ${type} ${isAnArray} `,
  });

  return ExtendedBaseApiResponse;
}

export class BaseApiErrorObject {
  @ApiProperty({ type: Number })
  public statusCode: number;

  @ApiProperty({ type: String })
  public message: string;

  @ApiPropertyOptional({ type: String })
  public localizedMessage: string;

  @ApiProperty({ type: Object })
  public details: unknown;

  @ApiProperty({ type: String })
  public code: EAppExceptionCode;
}

export class BaseApiErrorResponse {
  @ApiProperty({ type: BaseApiErrorObject })
  public error: BaseApiErrorObject;

  @ApiProperty({ type: BaseApiResponseMeta })
  public meta: BaseApiResponseMeta;
}
