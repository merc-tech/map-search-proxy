import { Controller, Get, Inject, Logger, Query } from "@nestjs/common";
import { SearchPlaceQuery, SearchPlaceResult } from './dto/search-place.dto';
import { LongdoMapService } from "src/longdo-map/longdo-map.service";
import { get } from "lodash";
import { plainToInstance } from "class-transformer";
import longdoMapConfig from "src/config/longdo-map.config";
import { ConfigType } from "@nestjs/config";

@Controller('search')
export class SearchController {

    private readonly logger = new Logger(SearchController.name);
    
    constructor(
        private readonly longdoMapService: LongdoMapService,
        @Inject(longdoMapConfig.KEY) private readonly longdoMapConf: ConfigType<typeof longdoMapConfig> 
    ) { }

    @Get()
    async searchPlace(@Query() query: SearchPlaceQuery) {

        const apiKey = this.longdoMapConf.randomApiKey();
        this.logger.debug(`API Key: ${apiKey}`);
        
        const result = await this.longdoMapService.smartSearch({
            lat: +query.lat,
            lon: +query.lon,
            limit: 1,
            key: apiKey,
        })

        return plainToInstance(SearchPlaceResult, get(result, ['data']), {
            excludeExtraneousValues: true,
        })
    }
}