import { Controller, Get, Query } from '@nestjs/common'
import { DailyStats, MonthlyStats } from '../schema/usage-stats.schema'
import { UsageStatsService } from '../search/usage-stats.service'

@Controller('usage')
export class UsageController {
  constructor(private readonly usageStatsService: UsageStatsService) {}

  @Get('daily')
  async getDailyStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<DailyStats[]> {
    const now = new Date()
    const defaultStartDate = new Date(now.getFullYear(), now.getMonth(), 1) // First day of current month
    const defaultEndDate = new Date(now.getFullYear(), now.getMonth() + 1, 0) // Last day of current month

    return await this.usageStatsService.getDailyStats(
      startDate ? new Date(startDate) : defaultStartDate,
      endDate ? new Date(endDate) : defaultEndDate,
    )
  }

  @Get('monthly')
  async getMonthlyStats(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<MonthlyStats[]> {
    const now = new Date()
    const defaultStartDate = new Date(now.getFullYear(), 0, 1) // January 1st of current year
    const defaultEndDate = new Date(now.getFullYear(), 11, 31) // December 31st of current year

    return await this.usageStatsService.getMonthlyStats(
      startDate ? new Date(startDate) : defaultStartDate,
      endDate ? new Date(endDate) : defaultEndDate,
    )
  }
}
