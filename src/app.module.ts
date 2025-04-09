import { Module } from '@nestjs/common';
import { LongdoMapModule } from './longdo-map/longdo-map.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import longdoMapConfig from './config/longdo-map.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [
        longdoMapConfig
      ],
      envFilePath: ['.env'],
    }),
    LongdoMapModule.forRoot({
      isGlobal: true
    }),
    SearchModule
  ],
})
export class AppModule { }
