import { Module } from '@nestjs/common';
import { LongdoMapModule } from './longdo-map/longdo-map.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    LongdoMapModule.forRoot({
      isGlobal:true
    }),
    SearchModule
  ],
})
export class AppModule { }
