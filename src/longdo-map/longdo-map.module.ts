import { HttpModule } from '@nestjs/axios'
import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ProviderApiKeyModule } from '../provider-api-key/provider-api-key.module'
import { ConfigurableModuleClass } from './longdo-map.module-definition'
import { LongdoMapService } from './longdo-map.service'

@Module({
  imports: [
    HttpModule,
    ProviderApiKeyModule,
  ],
  providers: [LongdoMapService],
  exports: [LongdoMapService],
})
export class LongdoMapModule
  extends ConfigurableModuleClass
  implements OnModuleInit
{
  constructor(
    private readonly configService: ConfigService,
  ) {
    super()
  }

  async onModuleInit() {
    // API keys are now initialized in the ProviderApiKeyModule
  }
}
