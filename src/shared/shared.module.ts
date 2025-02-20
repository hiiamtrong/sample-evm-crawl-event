import { RedisModule } from '@nestjs-modules/ioredis';
import { ClassSerializerInterceptor, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/modules/configs/config.module';
import { AppConfigService } from 'src/modules/configs/config.service';
import { HttpExceptionsFilter } from 'src/shared/filters/http-exceptions.filter';
import { HttpLoggingInterceptor } from 'src/shared/interceptors/http-logging.interceptor';
import { BaseApiResponseInterceptor } from 'src/shared/interceptors/http-response.interceptor';
import { KafkaModule } from 'src/shared/kafka/kafka.module';
import { getRedisConfig } from 'src/shared/redis/redis';

@Global()
@Module({
  imports: [
    AppConfigModule,
    RedisModule.forRootAsync({
      useFactory: (config: AppConfigService) => {
        return getRedisConfig(config);
      },
      inject: [AppConfigService],
    }),
    KafkaModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (config: AppConfigService) => ({
        type: 'postgres',
        host: config.db.host,
        port: config.db.port,
        database: config.db.name,
        username: config.db.user,
        password: config.db.pass,
        entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
        // Timezone configured on the Postgres server.
        // This is used to typecast server date/time values to JavaScript Date object and vice versa.
        timezone: 'Z',
        synchronize: false,
        debug: config.app.env === 'development',
      }),
    }),
  ],
  exports: [AppConfigModule,],
  providers: [{ provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionsFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: BaseApiResponseInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },],
})
export class SharedModule { }
