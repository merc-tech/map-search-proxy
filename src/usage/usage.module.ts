import { Module } from '@nestjs/common'
import { UsageStatsModule } from '../search/usage-stats.module'
import { UsageController } from './usage.controller'

@Module({
  imports: [UsageStatsModule],
  controllers: [UsageController],
})
export class UsageModule {}
