// dto/refresh-token.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token issued during login',
  })
  @IsString()
  @MinLength(80)
  refreshToken!: string;
}
