import { ApiProperty } from '@nestjs/swagger';

class SuperAdminSummaryDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  accessLevel!: string;
}

export class SuperAdminLoginResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty({ type: SuperAdminSummaryDto })
  superAdmin!: SuperAdminSummaryDto;
}

export class SuperAdminRefreshResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  refreshToken!: string;
}

export class SuperAdminMessageResponseDto {
  @ApiProperty()
  message!: string;
}

export class SuperAdminMeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  phone!: string | null;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty({ nullable: true })
  photoUrl!: string | null;

  @ApiProperty()
  accessLevel!: string;

  @ApiProperty()
  status!: string;
}
