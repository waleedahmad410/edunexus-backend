import { Test, TestingModule } from '@nestjs/testing';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import type { HealthStatus } from './../src/app.service';

describe('Health endpoint (e2e)', () => {
  let app: NestFastifyApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  it('/api/health (GET)', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/health',
    });

    const body = JSON.parse(response.payload) as HealthStatus;

    expect(response.statusCode).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.uptime).toEqual(expect.any(Number));
    expect(body.timestamp).toEqual(expect.any(String));
    expect(Number.isNaN(Date.parse(body.timestamp))).toBe(false);
  });

  afterEach(async () => {
    await app.close();
  });
});
