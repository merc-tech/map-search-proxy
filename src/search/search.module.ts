import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlaceCache, PlaceCacheSchema } from 'src/schema/place-cache.schema'
import { SearchController } from './search.controller'
import {
  DailyStats,
  DailyStatsSchema,
  MonthlyStats,
  MonthlyStatsSchema,
} from 'src/schema/usage-stats.schema'
import { UsageService } from 'src/usage/usage.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PlaceCache.name,
        schema: PlaceCacheSchema,
      },
      { name: DailyStats.name, schema: DailyStatsSchema },
      {
        name: MonthlyStats.name,
        schema: MonthlyStatsSchema,
      },
    ]),
  ],
  controllers: [SearchController],
  providers:[UsageService]
})
export class SearchModule {}
