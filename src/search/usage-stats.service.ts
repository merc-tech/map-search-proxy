import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  DailyStats,
  DailyStatsDocument,
  MonthlyStats,
  MonthlyStatsDocument,
} from '../schema/usage-stats.schema'

@Injectable()
export class UsageStatsService {
  constructor(
    @InjectModel(DailyStats.name)
    private dailyStatsModel: Model<DailyStatsDocument>,
    @InjectModel(MonthlyStats.name)
    private monthlyStatsModel: Model<MonthlyStatsDocument>,
  ) {}

  async incrementCacheHits(): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day
    const month = new Date(today.getFullYear(), today.getMonth(), 1)

    await Promise.all([
      this.dailyStatsModel.findOneAndUpdate(
        { date: today },
        { $inc: { cacheHits: 1 } },
        { upsert: true, new: true },
      ),
      this.monthlyStatsModel.findOneAndUpdate(
        { date: month },
        { $inc: { cacheHits: 1 } },
        { upsert: true, new: true },
      ),
    ])
  }

  async incrementApiCalls(): Promise<void> {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day
    const month = new Date(today.getFullYear(), today.getMonth(), 1)

    await Promise.all([
      this.dailyStatsModel.findOneAndUpdate(
        { date: today },
        { $inc: { apiCalls: 1 } },
        { upsert: true, new: true },
      ),
      this.monthlyStatsModel.findOneAndUpdate(
        { date: month },
        { $inc: { apiCalls: 1 } },
        { upsert: true, new: true },
      ),
    ])
  }

  async getDailyStats(startDate: Date, endDate: Date): Promise<DailyStats[]> {
    try {
      // Since data is already grouped by date during insertion, we just need to fetch it
      return await this.dailyStatsModel
        .find({
          date: {
            $gte: new Date(startDate.setHours(0, 0, 0, 0)),
            $lte: new Date(endDate.setHours(23, 59, 59, 999)),
          },
        })
        .sort({ date: 1 })
        .exec()
    } catch (error) {
      console.error('Error fetching daily stats:', error)
      throw new Error('Failed to fetch daily stats')
    }
  }

  async getMonthlyStats(
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlyStats[]> {
    try {
      return await this.monthlyStatsModel
        .find({
          date: { $gte: startDate, $lte: endDate },
        })
        .sort({ date: 1 })
        .exec()
    } catch (error) {
      console.error('Error fetching monthly stats:', error)
      throw new Error('Failed to fetch monthly stats')
    }
  }
}
