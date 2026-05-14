import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { SuperAdminAuthService } from './super-admin-auth.service';
import {
  SuperAdminLoginResponseDto,
  SuperAdminMessageResponseDto,
  SuperAdminRefreshResponseDto,
} from './dto/super-admin-auth.response.dto';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { SuperAdminAccessGuard } from './guards/super-admin-access.guard';
import { CurrentSuperAdmin } from './decorators/current-super-admin.decorator';
import type { CurrentSuperAdmin as CurrentSuperAdminType } from './types/auth-request.type';

@ApiTags('Super Admin Auth')
@Controller('super-admin/auth')
export class SuperAdminAuthController {
  constructor(private readonly authService: SuperAdminAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login super admin' })
  @ApiBody({ type: SuperAdminLoginDto })
  @ApiOkResponse({ type: SuperAdminLoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiForbiddenResponse({ description: 'Super admin account is not active' })
  login(
    @Body() dto: SuperAdminLoginDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ): Promise<SuperAdminLoginResponseDto> {
    return this.authService.login(dto, {
      ipAddress,
      userAgent,
    });
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: SuperAdminRefreshResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ApiForbiddenResponse({ description: 'Super admin account is not active' })
  refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<SuperAdminRefreshResponseDto> {
    return this.authService.refresh(dto);
  }

  @UseGuards(SuperAdminAccessGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout current session' })
  @ApiOkResponse({ type: SuperAdminMessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired access token' })
  logout(
    @CurrentSuperAdmin() admin: CurrentSuperAdminType,
  ): Promise<SuperAdminMessageResponseDto> {
    return this.authService.logout(admin.refreshTokenId);
  }

  @UseGuards(SuperAdminAccessGuard)
  @ApiBearerAuth()
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout all sessions' })
  @ApiOkResponse({ type: SuperAdminMessageResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired access token' })
  logoutAll(
    @CurrentSuperAdmin() admin: CurrentSuperAdminType,
  ): Promise<SuperAdminMessageResponseDto> {
    return this.authService.logoutAll(admin.userId);
  }

}