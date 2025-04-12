import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { get, isNil } from 'lodash'
import { Model } from 'mongoose'
import {
  DailyStats,
  DailyStatsDocument,
  MonthlyStats,
  MonthlyStatsDocument,
} from '../schema/usage-stats.schema'

@Injectable()
export class UsageService {
  constructor(
    @InjectModel(DailyStats.name)
    private dailyStatsModel: Model<DailyStatsDocument>,
    @InjectModel(MonthlyStats.name)
    private monthlyStatsModel: Model<MonthlyStatsDocument>,
  ) {}

  async incrementCacheHits(): Promise<void> {
    const today = dayjs().startOf('day').toDate()
    const month = dayjs().startOf('month').toDate()

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
    const today = dayjs().startOf('day').toDate()
    const month = dayjs().startOf('month').toDate()

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
    const start = !isNil(startDate)
      ? dayjs(startDate).startOf('day').toDate()
      : dayjs().startOf('day').toDate()
    const end = !isNil(endDate)
      ? dayjs(endDate).endOf('day').toDate()
      : dayjs().endOf('day').toDate()

    return await this.dailyStatsModel
      .find({
        date: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ date: 1 })
      .exec()
  }

  async getMonthlyStats(
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlyStats[]> {
    try {
      const start = !isNil(startDate)
        ? dayjs(startDate).startOf('month').toDate()
        : dayjs().startOf('month').toDate()
      const end = !isNil(endDate)
        ? dayjs(endDate).endOf('month').toDate()
        : dayjs().endOf('month').toDate()

      console.log('Fetching monthly stats with date range:', {
        start,
        end,
      })

      const results = await this.monthlyStatsModel
        .find({
          date: { $gte: start, $lte: end },
        })
        .sort({ date: 1 })
        .exec()

      console.log('Found monthly stats:', results.length)
      return results
    } catch (error) {
      console.error('Error fetching monthly stats:', error)
      throw new Error('Failed to fetch monthly stats')
    }
  }
}
