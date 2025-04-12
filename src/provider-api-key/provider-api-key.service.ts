import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import {
  ProviderApiKeyUsage,
  ProviderApiKeyUsageDocument,
  MonthlyProviderApiKeyUsage,
} from '../schema/provider-api-key-usage.schema'
import { ProviderApiKey, ProviderApiKeyDocument } from '../schema/provider-api-key.schema'
import { CreateApiKeyDto } from './dto/create-api-key.dto'
import { UpdateApiKeyDto } from './dto/update-api-key.dto'

@Injectable()
export class ProviderApiKeyService {
  private readonly logger = new Logger(ProviderApiKeyService.name)
  private currentIndex = 0
  private apiKeys: ProviderApiKeyDocument[] = []

  constructor(
    @InjectModel(ProviderApiKey.name)
    private apiKeyModel: Model<ProviderApiKeyDocument>,
    @InjectModel(ProviderApiKeyUsage.name)
    private apiKeyUsageModel: Model<ProviderApiKeyUsageDocument>,
  ) {
    this.loadApiKeys()
  }

  /**
   * Load API keys from the database
   */
  private async loadApiKeys(): Promise<void> {
    try {
      this.apiKeys = await this.apiKeyModel.find({ isActive: true }).exec()
      this.logger.log(`Loaded ${this.apiKeys.length} active API keys`)
    } catch (error) {
      this.logger.error('Failed to load API keys', error)
    }
  }

  /**
   * Get a random API key using round-robin selection
   */
  async getRandomApiKey(): Promise<string> {
    if (this.apiKeys.length === 0) {
      await this.loadApiKeys()
    }

    if (this.apiKeys.length === 0) {
      this.logger.error('No active API keys found')
      throw new Error('No active API keys found')
    }

    // Round-robin selection
    const apiKey = this.apiKeys[this.currentIndex]
    this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length

    // Update usage count and last used timestamp
    await this.recordApiKeyUsage(apiKey._id.toString())

    return apiKey.key
  }

  /**
   * Record API key usage
   */
  private async recordApiKeyUsage(apiKeyId: string): Promise<void> {
    const today = dayjs().startOf('day').toDate()

    try {
      // Update the API key document
      await this.apiKeyModel.findByIdAndUpdate(
        apiKeyId,
        {
          $inc: { usageCount: 1 },
          lastUsedAt: new Date(),
        },
        { new: true },
      )

      // Update the daily usage record
      await this.apiKeyUsageModel.findOneAndUpdate(
        { apiKeyId, date: today },
        { $inc: { usageCount: 1 } },
        { upsert: true, new: true },
      )
    } catch (error) {
      this.logger.error(`Failed to record API key usage for ${apiKeyId}`, error)
    }
  }

  /**
   * Get daily usage stats for all API keys
   */
  async getDailyUsageStats(
    startDate: Date,
    endDate: Date,
  ): Promise<ProviderApiKeyUsage[]> {
    return await this.apiKeyUsageModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate('apiKeyId')
      .sort({ date: 1, apiKeyId: 1 })
      .exec()
  }

  /**
   * Get monthly usage stats for all API keys
   */
  async getMonthlyUsageStats(
    startDate: Date,
    endDate: Date,
  ): Promise<MonthlyProviderApiKeyUsage[]> {
    // Aggregate daily stats into monthly stats
    return await this.apiKeyUsageModel.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            apiKeyId: '$apiKeyId',
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          usageCount: { $sum: '$usageCount' },
        },
      },
      {
        $project: {
          _id: 0,
          apiKeyId: '$_id.apiKeyId',
          date: {
            $dateFromParts: {
              year: '$_id.year',
              month: '$_id.month',
              day: 1,
            },
          },
          usageCount: 1,
        },
      },
      {
        $sort: { date: 1, apiKeyId: 1 },
      },
    ])
  }

  /**
   * Initialize API keys from environment variables
   */
  async initializeApiKeys(apiKeys: string[]): Promise<void> {
    try {
      for (const key of apiKeys) {
        await this.apiKeyModel.findOneAndUpdate(
          { key },
          { isActive: true },
          { upsert: true, new: true },
        )
      }
      await this.loadApiKeys()
      this.logger.log(`Initialized ${apiKeys.length} API keys`)
    } catch (error) {
      this.logger.error('Failed to initialize API keys', error)
    }
  }

  /**
   * Create a new API key
   */
  async createApiKey(createApiKeyDto: CreateApiKeyDto): Promise<ProviderApiKey> {
    const newApiKey = new this.apiKeyModel(createApiKeyDto)
    return await newApiKey.save()
  }

  /**
   * Get all API keys
   */
  async findAllApiKeys(): Promise<ProviderApiKey[]> {
    return await this.apiKeyModel.find().exec()
  }

  /**
   * Get an API key by ID
   */
  async findApiKeyById(id: string): Promise<ProviderApiKey> {
    const apiKey = await this.apiKeyModel.findById(id).exec()
    if (!apiKey) {
      throw new NotFoundException(`API key with ID ${id} not found`)
    }
    return apiKey
  }

  /**
   * Update an API key
   */
  async updateApiKey(id: string, updateApiKeyDto: UpdateApiKeyDto): Promise<ProviderApiKey> {
    const updatedApiKey = await this.apiKeyModel
      .findByIdAndUpdate(id, updateApiKeyDto, { new: true })
      .exec()
    
    if (!updatedApiKey) {
      throw new NotFoundException(`API key with ID ${id} not found`)
    }
    
    // Reload API keys if active status changed
    if (updateApiKeyDto.isActive !== undefined) {
      await this.loadApiKeys()
    }
    
    return updatedApiKey
  }

  /**
   * Delete an API key
   */
  async deleteApiKey(id: string): Promise<void> {
    const result = await this.apiKeyModel.findByIdAndDelete(id).exec()
    if (!result) {
      throw new NotFoundException(`API key with ID ${id} not found`)
    }
    await this.loadApiKeys()
  }
} 