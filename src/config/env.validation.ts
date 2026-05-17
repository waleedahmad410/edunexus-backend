import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV!: Environment;

  @IsString()
  @IsNotEmpty()
  APP_NAME!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  APP_PORT!: number;

  @IsString()
  @IsNotEmpty()
  API_PREFIX!: string;

  @IsString()
  @IsNotEmpty()
  DB_HOST!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  DB_PORT!: number;

  @IsString()
  @IsNotEmpty()
  DB_USER!: string;

  @IsString()
  @IsNotEmpty()
  DB_PASSWORD!: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME!: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+[smhd]$/, {
    message: 'JWT_ACCESS_EXPIRES_IN must be like 15m, 1h, or 7d.',
  })
  JWT_ACCESS_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+[smhd]$/, {
    message: 'JWT_REFRESH_EXPIRES_IN must be like 15m, 1h, or 7d.',
  })
  JWT_REFRESH_EXPIRES_IN!: string;

  @IsString()
  @IsNotEmpty()
  CORS_ORIGINS!: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validatedConfig = plainToInstance(
    EnvironmentVariables,
    {
      NODE_ENV: config.NODE_ENV,

      APP_NAME: config.APP_NAME,
      APP_PORT: Number(config.APP_PORT),
      API_PREFIX: config.API_PREFIX,
      CORS_ORIGINS: config.CORS_ORIGINS,

      DB_HOST: config.DB_HOST,
      DB_PORT: Number(config.DB_PORT),
      DB_USER: config.DB_USER,
      DB_PASSWORD: config.DB_PASSWORD,
      DB_NAME: config.DB_NAME,

      JWT_ACCESS_SECRET: config.JWT_ACCESS_SECRET,
      JWT_REFRESH_SECRET: config.JWT_REFRESH_SECRET,
      JWT_ACCESS_EXPIRES_IN: config.JWT_ACCESS_EXPIRES_IN,
      JWT_REFRESH_EXPIRES_IN: config.JWT_REFRESH_EXPIRES_IN,
    },
    {
      enableImplicitConversion: true,
    },
  );

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
