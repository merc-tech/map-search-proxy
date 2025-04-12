import { Transform } from 'class-transformer'
import { IsISO8601, IsOptional } from 'class-validator'
import dayjs from 'dayjs'

export class MonthlyStatsDto {
  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    console.log('Transforming startDate:', value)
    if (value) {
      const date = dayjs(value)
      const result = date.isValid() ? date.startOf('month').toDate() : dayjs().startOf('month').toDate()
      console.log('Transformed startDate:', result)
      return result
    }
    const result = dayjs().startOf('month').toDate()
    console.log('Default startDate:', result)
    return result
  })
  startDate: Date

  @IsOptional()
  @IsISO8601()
  @Transform(({ value }) => {
    console.log('Transforming endDate:', value)
    if (value) {
      const date = dayjs(value)
      const result = date.isValid() ? date.endOf('month').toDate() : dayjs().endOf('month').toDate()
      console.log('Transformed endDate:', result)
      return result
    }
    const result = dayjs().endOf('month').toDate()
    console.log('Default endDate:', result)
    return result
  })
  endDate: Date
}
