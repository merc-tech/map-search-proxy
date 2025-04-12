/**
 * 
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CatDocument = HydratedDocument<Cat>;

@Schema()
export class Cat {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const CatSchema = SchemaFactory.createForClass(Cat);

 */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydrateOptions, HydratedDocument } from 'mongoose'

export interface GeoPoint {
  type: string
  coordinates: number[]
}

@Schema({ timestamps: true, collection: 'placeCaches' })
export class PlaceCache {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  address: string

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  location: GeoPoint

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date

  @Prop({ required: true })
  expiredAt: Date
}

export type PlaceCacheDocument = HydratedDocument<PlaceCache>
export const PlaceCacheSchema = SchemaFactory.createForClass(PlaceCache)
PlaceCacheSchema.index({ location: '2dsphere' })
