import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import longdoMapConfig from './config/longdo-map.config'
import { LongdoMapModule } from './longdo-map/longdo-map.module'
import { SearchModule } from './search/search.module'
import { UsageModule } from './usage/usage.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [longdoMapConfig],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/', {
      dbName: 'map-search-proxy',
      authSource: 'admin',
      auth: {
        username: 'root',
        password: 'super_secret',
      },
    }),

    LongdoMapModule.forRoot({
      isGlobal: true,
    }),

    SearchModule,
    UsageModule,
  ],
})
export class AppModule {}
