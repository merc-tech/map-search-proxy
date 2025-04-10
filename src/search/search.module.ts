import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { PlaceCache, PlaceCacheSchema } from "src/schema/place-cache.schema";

@Module({
    imports:[
           MongooseModule.forFeature([{
              name: PlaceCache.name,
              schema: PlaceCacheSchema,
            }]),
    ],
    controllers:[
    SearchController
]})
export class SearchModule {
}