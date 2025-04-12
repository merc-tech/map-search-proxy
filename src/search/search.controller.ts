import { Controller, Get, Logger, Query } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { plainToInstance } from 'class-transformer'
import dayjs from 'dayjs'
import { get, isNil, pick } from 'lodash'
import { Model } from 'mongoose'
import { LongdoMapService } from 'src/longdo-map/longdo-map.service'
import { PlaceCache, PlaceCacheDocument } from 'src/schema/place-cache.schema'
import { SearchPlaceQuery, SearchPlaceResult } from './dto/search-place.dto'
import { UsageService } from '../usage/usage.service'

@Controller('search')
export class SearchController {
  private readonly logger = new Logger(SearchController.name)

  constructor(
    private readonly longdoMapService: LongdoMapService,
    @InjectModel(PlaceCache.name)
    private placeCacheModel: Model<PlaceCacheDocument>,
    private readonly usageStatsService: UsageService,
  ) {}

  @Get('/place')
  async searchPlace(@Query() query: SearchPlaceQuery) {
    this.logger.debug('Searching for place')

    let place: SearchPlaceResult | null = null

    const cache = await this.placeCacheModel.findOne({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [query.lon, query.lat],
          },
          $maxDistance: 1000,
        },
      },
      expiredAt: {
        $gt: dayjs().toDate(),
      },
    })

    if (cache) {
      this.logger.debug('Cache Hit')
      this.usageStatsService.incrementCacheHits().catch((e) => {
        this.logger.error('Failed to increment cache hits', e)
      })

      place = {
        name: get(cache, 'name'),
        address: get(cache, 'address'),
        lat: get(cache, 'location.coordinates.1'),
        lon: get(cache, 'location.coordinates.0'),
      }
    } else {
      this.logger.debug('Cache Miss')
      this.logger.debug('Querying Longdo Map API')
      this.usageStatsService.incrementApiCalls().catch((e) => {
        this.logger.error('Failed to increment API calls', e)
      })

      const result = await this.longdoMapService.smartSearch({
        lat: +query.lat,
        lon: +query.lon,
        limit: 1,
      })

      if (!isNil(result)) {
        const firstResult = get(result, ['data', 0])
        place = pick(firstResult, ['name', 'address', 'lat', 'lon'])

        const newPlaceCache = new this.placeCacheModel({
          name: get(place, 'name'),
          address: get(place, 'address'),
          location: {
            type: 'Point',
            coordinates: [get(place, 'lon'), get(place, 'lat')],
          },
          expiredAt: dayjs().add(30, 'day').toDate(),
        })

        await newPlaceCache.save()
      }
    }
    return plainToInstance(SearchPlaceResult, place, {
      excludeExtraneousValues: true,
    })
  }
}
