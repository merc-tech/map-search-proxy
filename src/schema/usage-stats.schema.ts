import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type DailyStatsDocument = HydratedDocument<DailyStats>
export type MonthlyStatsDocument = HydratedDocument<MonthlyStats>

@Schema({ timestamps: true, collection: 'dailyStats' })
export class DailyStats {
  @Prop({ required: true, type: Date, index: true })
  date: Date

  @Prop({ required: true, default: 0 })
  cacheHits: number

  @Prop({ required: true, default: 0 })
  apiCalls: number
}

@Schema({ timestamps: true, collection: 'monthlyStats' })
export class MonthlyStats {
  @Prop({ required: true, type: Date, index: true })
  date: Date

  @Prop({ required: true, default: 0 })
  cacheHits: number

  @Prop({ required: true, default: 0 })
  apiCalls: number
}

export const DailyStatsSchema = SchemaFactory.createForClass(DailyStats)
export const MonthlyStatsSchema = SchemaFactory.createForClass(MonthlyStats)

// Create indexes for efficient querying
DailyStatsSchema.index({ date: 1 })
MonthlyStatsSchema.index({ date: 1 })
