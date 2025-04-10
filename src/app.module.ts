import { Module } from '@nestjs/common';
import { LongdoMapModule } from './longdo-map/longdo-map.module';
import { SearchModule } from './search/search.module';
import { ConfigModule } from '@nestjs/config';
import longdoMapConfig from './config/longdo-map.config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlaceCache, PlaceCacheSchema } from './schema/place-cache.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [
        longdoMapConfig
      ],
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/',{
      dbName: 'map-search-proxy',
      authSource: 'admin',
      auth:{
        username: 'root',
        password: 'super_secret'
      }
    }),

    LongdoMapModule.forRoot({
      isGlobal: true
    }),

    SearchModule
  ],
})
export class AppModule { }
