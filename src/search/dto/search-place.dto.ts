import { Expose } from 'class-transformer';
import { IsLatitude, IsLongitude } from 'class-validator';

export class SearchPlaceQuery {
    @IsLatitude()
    lat: string;


    @IsLongitude()
    lon: string;
}

export class SearchPlaceResult {
    @Expose()
    name: string;

    @Expose()
    lat: number;
    
    @Expose()
    lon: number;

    @Expose()
    address: string;
}