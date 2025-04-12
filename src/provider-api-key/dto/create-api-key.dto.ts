import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class CreateApiKeyDto {
  @IsString()
  key: string

  @IsBoolean()
  @IsOptional()
  isActive?: boolean

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  provider?: string
} 