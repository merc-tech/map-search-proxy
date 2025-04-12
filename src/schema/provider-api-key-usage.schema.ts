import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProviderApiKeyUsageDocument = HydratedDocument<ProviderApiKeyUsage>

@Schema({ timestamps: true, collection: 'providerApiKeyUsage' })
export class ProviderApiKeyUsage {
  @Prop({ required: true, ref: 'ProviderApiKey' })
  apiKeyId: string

  @Prop({ required: true, type: Date, index: true })
  date: Date

  @Prop({ required: true, default: 0 })
  usageCount: number
}

export interface MonthlyProviderApiKeyUsage {
  apiKeyId: string
  date: Date
  usageCount: number
}

export const ProviderApiKeyUsageSchema = SchemaFactory.createForClass(ProviderApiKeyUsage)

// Create indexes for efficient querying
ProviderApiKeyUsageSchema.index({ apiKeyId: 1, date: 1 }, { unique: true })
ProviderApiKeyUsageSchema.index({ date: 1 }) 