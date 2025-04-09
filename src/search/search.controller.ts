import { Controller, Get, Query } from "@nestjs/common";
import { SearchPlaceQuery, SearchPlaceResult } from './dto/search-place.dto';
import { LongdoMapService } from "src/longdo-map/longdo-map.service";
import { get } from "lodash";
import { plainToInstance } from "class-transformer";

@Controller('search')
export class SearchController {
    constructor(
        private readonly longdoMapService: LongdoMapService
    ) { }

    @Get()
    async searchPlace(@Query() query: SearchPlaceQuery) {
        // Do Cache Logic Here
        const result = await this.longdoMapService.smartSearch({
            lat: +query.lat,
            lon: +query.lon,
            limit: 1,
            key: "57b4241424a1e86efca13aabf7352f2d",
        })

        return plainToInstance(SearchPlaceResult, get(result, ['data']), {
            excludeExtraneousValues: true,

        })
    }
}