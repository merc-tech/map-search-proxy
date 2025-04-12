import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ProviderApiKey } from '../schema/provider-api-key.schema'
import { ProviderApiKeyUsage, MonthlyProviderApiKeyUsage } from '../schema/provider-api-key-usage.schema'
import { DailyStatsDto } from './dto/daily-stats.dto'
import { MonthlyStatsDto } from './dto/monthly-stats.dto'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { UpdateApiKeyDto } from './dto/update-api-key.dto'
import { ProviderApiKeyService } from './provider-api-key.service'

@Controller('api-keys')
export class ProviderApiKeyController {
  constructor(private readonly apiKeyService: ProviderApiKeyService) {}

  @Get('usage/daily')
  async getDailyUsageStats(
    @Query() dateRange: DailyStatsDto,
  ): Promise<ProviderApiKeyUsage[]> {
    return await this.apiKeyService.getDailyUsageStats(
      dateRange.startDate,
      dateRange.endDate,
    )
  }

  @Get('usage/monthly')
  async getMonthlyUsageStats(
    @Query() dateRange: MonthlyStatsDto,
  ): Promise<MonthlyProviderApiKeyUsage[]> {
    return await this.apiKeyService.getMonthlyUsageStats(
      dateRange.startDate,
      dateRange.endDate,
    )
  }

  @Post()
  async createApiKey(
    @Body() createApiKeyDto: CreateApiKeyDto,
  ): Promise<ProviderApiKey> {
    return await this.apiKeyService.createApiKey(createApiKeyDto)
  }

  @Get()
  async findAllApiKeys(): Promise<ProviderApiKey[]> {
    return await this.apiKeyService.findAllApiKeys()
  }

  @Get(':id')
  async findApiKeyById(@Param('id') id: string): Promise<ProviderApiKey> {
    return await this.apiKeyService.findApiKeyById(id)
  }

  @Put(':id')
  async updateApiKey(
    @Param('id') id: string,
    @Body() updateApiKeyDto: UpdateApiKeyDto,
  ): Promise<ProviderApiKey> {
    return await this.apiKeyService.updateApiKey(id, updateApiKeyDto)
  }

  @Delete(':id')
  async deleteApiKey(@Param('id') id: string): Promise<void> {
    return await this.apiKeyService.deleteApiKey(id)
  }
} 