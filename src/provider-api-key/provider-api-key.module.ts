import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ProviderApiKey, ProviderApiKeySchema } from '../schema/provider-api-key.schema'
import { ProviderApiKeyUsage, ProviderApiKeyUsageSchema } from '../schema/provider-api-key-usage.schema'
import { ProviderApiKeyController } from './provider-api-key.controller'
import { ProviderApiKeyService } from './provider-api-key.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProviderApiKey.name, schema: ProviderApiKeySchema },
      { name: ProviderApiKeyUsage.name, schema: ProviderApiKeyUsageSchema },
    ]),
  ],
  controllers: [ProviderApiKeyController],
  providers: [ProviderApiKeyService],
  exports: [ProviderApiKeyService],
})
export class ProviderApiKeyModule implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly apiKeyService: ProviderApiKeyService,
  ) {}

  async onModuleInit() {
    const apiKeys =
      this.configService.get<string>('LONGDO_MAP_API_KEY')?.split(',') || []
    if (apiKeys.length > 0) {
      await this.apiKeyService.initializeApiKeys(apiKeys)
    }
  }
} 