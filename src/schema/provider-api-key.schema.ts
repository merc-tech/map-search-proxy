import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type ProviderApiKeyDocument = HydratedDocument<ProviderApiKey>

@Schema({ timestamps: true, collection: 'providerApiKeys' })
export class ProviderApiKey {
  @Prop({ required: true, unique: true })
  key: string

  @Prop({ required: true, default: true })
  isActive: boolean

  @Prop({ required: true, default: 0 })
  lastUsedAt: Date

  @Prop({ required: true, default: 0 })
  usageCount: number

  @Prop({ required: false })
  description?: string

  @Prop({ required: false })
  provider?: string
}

export const ProviderApiKeySchema = SchemaFactory.createForClass(ProviderApiKey)

// Create indexes for efficient querying
ProviderApiKeySchema.index({ key: 1 }, { unique: true })
ProviderApiKeySchema.index({ isActive: 1 }) 