import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import {
  DailyStats,
  DailyStatsSchema,
  MonthlyStats,
  MonthlyStatsSchema,
} from '../schema/usage-stats.schema'
import { UsageStatsService } from './usage-stats.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyStats.name, schema: DailyStatsSchema },
      { name: MonthlyStats.name, schema: MonthlyStatsSchema },
    ]),
  ],
  providers: [UsageStatsService],
  exports: [UsageStatsService],
})
export class UsageStatsModule {}
