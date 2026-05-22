import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import type { HealthStatus } from './app.service';

@Controller('health')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  getHealth(): HealthStatus {
    return this.appService.getHealth();
  }
}
