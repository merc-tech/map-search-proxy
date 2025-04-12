import { Module } from '@nestjs/common'
import { UsageController } from './usage.controller'
import { UsageService } from './usage.service'
import {
  DailyStats,
  DailyStatsSchema,
  MonthlyStats,
  MonthlyStatsSchema,
} from 'src/schema/usage-stats.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyStats.name, schema: DailyStatsSchema },
      {
        name: MonthlyStats.name,
        schema: MonthlyStatsSchema,
      },
    ]),
  ],
  controllers: [UsageController],
  providers: [UsageService],
})
export class UsageModule {}
