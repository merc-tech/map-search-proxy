import { Transform } from 'class-transformer'
import { IsISO8601, IsOptional } from 'class-validator'
import dayjs from 'dayjs'

export class MonthlyStatsDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    if (value) {
      const date = dayjs(value)
      return date.isValid() ? date.toDate() : dayjs().startOf('year').toDate()
    }
    return dayjs().startOf('year').toDate()
  })
  startDate: Date

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    if (value) {
      const date = dayjs(value)
      return date.isValid() ? date.toDate() : dayjs().endOf('year').toDate()
    }
    return dayjs().endOf('year').toDate()
  })
  endDate: Date
}
