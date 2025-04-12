import { Transform } from 'class-transformer'
import { IsDate, IsOptional } from 'class-validator'
import dayjs from 'dayjs'

export class DailyStatsDto {
  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    if (!value) {
      return dayjs().startOf('month').toDate()
    }
    const date = dayjs(value)
    return date.isValid() ? date.toDate() : dayjs().toDate()
  })
  startDate: Date

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => {
    if (!value) {
      return dayjs().endOf('month').toDate()
    }
    const date = dayjs(value)
    return date.isValid() ? date.toDate() : dayjs().toDate()
  })
  endDate: Date
}
