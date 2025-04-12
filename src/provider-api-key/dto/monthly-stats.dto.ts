import { Transform } from 'class-transformer'
import { IsISO8601, IsOptional } from 'class-validator'
import dayjs from 'dayjs'

export class MonthlyStatsDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    if (value) {
      const date = dayjs(value)
      return date.isValid() ? date.startOf('month').toDate() : dayjs().startOf('month').toDate()
    }
    return dayjs().startOf('month').toDate()
  })
  startDate: Date

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    if (value) {
      const date = dayjs(value)
      return date.isValid() ? date.endOf('month').toDate() : dayjs().endOf('month').toDate()
    }
    return dayjs().endOf('month').toDate()
  })
  endDate: Date
} 