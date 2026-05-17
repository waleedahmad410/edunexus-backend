import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from '@fastify/helmet';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/env.validation';
import { getCorsOptions, setupSwagger } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService =
    app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const port = configService.getOrThrow<number>('APP_PORT');
  const apiPrefix = configService.getOrThrow<string>('API_PREFIX');
  const corsOptions = getCorsOptions(configService);

  await app.register(helmet);

  app.enableCors(corsOptions);
  app.setGlobalPrefix(apiPrefix);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
    }),
  );

  setupSwagger(app, apiPrefix);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();
