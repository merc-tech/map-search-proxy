import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigurableModuleClass } from './longdo-map.module-definition'
import { LongdoMapService } from './longdo-map.service'

@Module({
  imports: [HttpModule],
  providers: [LongdoMapService],
  exports: [LongdoMapService],
})
export class LongdoMapModule extends ConfigurableModuleClass {}
