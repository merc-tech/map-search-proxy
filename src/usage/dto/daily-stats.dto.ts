import { IsISO8601, IsOptional } from 'class-validator'
import { Transform } from 'class-transformer'

export class DailyStatsDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    if (value) return new Date(value)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  startDate: Date

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    if (value) return new Date(value)
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })
  endDate: Date
}