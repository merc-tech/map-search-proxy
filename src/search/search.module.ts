import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PlaceCache, PlaceCacheSchema } from 'src/schema/place-cache.schema'
import { SearchController } from './search.controller'
import { UsageStatsModule } from './usage-stats.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: PlaceCache.name,
        schema: PlaceCacheSchema,
      },
    ]),
    UsageStatsModule,
  ],
  controllers: [SearchController],
})
export class SearchModule {}
