import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './shared/utils/json';
import { AppConfigService } from 'src/modules/configs/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { VALIDATION_PIPE_OPTIONS } from 'src/shared/constants/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(VALIDATION_PIPE_OPTIONS));


  const config = app.get(AppConfigService);

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  /** Swagger configuration*/
  const options = new DocumentBuilder()
    .setTitle('Nestjs API starter')
    .setDescription('Nestjs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  const port = config.app.port;
  const host = config.app.host;

  await app.listen(port, host, () => {
    console.info(`Server is running on http://${host}:${port}`);
    console.info(`Swagger is running on http://${host}:${port}/swagger`);
  });
}
bootstrap();
