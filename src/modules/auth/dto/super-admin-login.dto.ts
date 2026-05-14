// dto/super-admin-login.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SuperAdminLoginDto {
  @ApiProperty({
    example: 'superadmin@edunexus.com',
    maxLength: 150,
  })
  @IsEmail()
  @MaxLength(150)
  email!: string;

  @ApiProperty({
    example: 'SuperAdmin@12345',
    minLength: 8,
    maxLength: 100,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiPropertyOptional({
    example: 'browser-1',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  deviceId?: string;

  @ApiPropertyOptional({
    example: 'Chrome on Windows',
    maxLength: 120,
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  deviceName?: string;
}
