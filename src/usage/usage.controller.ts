import { Controller, Get, Query } from '@nestjs/common'
import { DailyStats, MonthlyStats } from '../schema/usage-stats.schema'
import { UsageStatsService } from '../search/usage-stats.service'
import { DailyStatsDto } from './dto/daily-stats.dto'
import { MonthlyStatsDto } from './dto/monthly-stats.dto'

@Controller('usage')
export class UsageController {
  constructor(private readonly usageStatsService: UsageStatsService) {}

  @Get('daily')
  async getDailyStats(@Query() dateRange: DailyStatsDto): Promise<DailyStats[]> {
    return await this.usageStatsService.getDailyStats(dateRange.startDate, dateRange.endDate)
  }

  @Get('monthly')
  async getMonthlyStats(@Query() dateRange: MonthlyStatsDto): Promise<MonthlyStats[]> {
    return await this.usageStatsService.getMonthlyStats(dateRange.startDate, dateRange.endDate)
  }
}
