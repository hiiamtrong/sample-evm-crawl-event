import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  BaseApiResponse,
  PaginationResponseDto,
} from 'src/shared/dtos/base-api-response.dto';

@Injectable()
export class BaseApiResponseInterceptor<T>
  implements NestInterceptor<T, BaseApiResponse<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<BaseApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;
    const timestamp = new Date().toISOString();

    return next.handle().pipe(
      map((data) => {
        if (data instanceof PaginationResponseDto) {
          return {
            data: data.data as T,
            meta: {
              path,
              timestamp,
            },
            pagination: {
              total: data.total,
              page: data.page,
            },
          };
        }

        return {
          data,
          meta: {
            path,
            timestamp,
          },
        };
      }),
    );
  }
}
