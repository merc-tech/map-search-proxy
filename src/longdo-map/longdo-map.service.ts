import { HttpService } from '@nestjs/axios'
import { Injectable } from '@nestjs/common'
import { AxiosResponse } from 'axios'
import { firstValueFrom } from 'rxjs'
import { ProviderApiKeyService } from '../provider-api-key/provider-api-key.service'

@Injectable()
export class LongdoMapService {
  private readonly baseUrl = 'https://search.longdo.com'
  private readonly apiUrl = 'https://api.longdo.com'

  constructor(
    private readonly httpService: HttpService,
    private readonly apiKeyService: ProviderApiKeyService,
  ) {}

  async suggestPlace(params: {
    keyword: string
    area?: string
    offset?: number
    limit?: number
    dataset?: string
    callback?: string
    key?: string
  }): Promise<AxiosResponse['data']> {
    const apiKey = params.key || (await this.apiKeyService.getRandomApiKey())
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/mapsearch/json/suggest`, {
        params: { ...params, key: apiKey },
      }),
    )
    return response.data
  }

  async searchPlace(params: {
    keyword?: string
    area?: string
    lon?: number
    lat?: number
    span?: string
    tag?: string
    offset?: number
    limit?: number
    dataset?: string
    locale?: string
    callback?: string
    key?: string
  }): Promise<AxiosResponse['data']> {
    const apiKey = params.key || (await this.apiKeyService.getRandomApiKey())
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/mapsearch/json/search`, {
        params: { ...params, key: apiKey },
      }),
    )
    return response.data
  }

  async smartSearch(params: {
    keyword?: string
    area?: string
    lon?: number
    lat?: number
    span?: string
    tag?: string
    offset?: number
    limit?: number
    dataset?: string
    locale?: string
    callback?: string
    forcesmartsearch?: number
    forcelimit?: number
    extendedsearch?: number
    extendedlimit?: number
    extendedkey?: string
    extendedtype?: string
    exceedtime?: number
    cache?: number
    extractaddress?: number
    key?: string
  }): Promise<AxiosResponse['data']> {
    if (!params.keyword) {
      params.keyword = ' '
    }

    const apiKey = params.key || (await this.apiKeyService.getRandomApiKey())
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.baseUrl}/smartsearch/json/search`, {
        params: { ...params, key: apiKey },
      }),
    )
    return response.data
  }

  async nearbyPlace(params: {
    area?: string
    lon?: number
    lat?: number
    span?: string
    tag?: string
    zoom?: number
    offset?: number
    limit?: number
    dataset?: string
    locale?: string
    callback?: string
    key?: string
  }): Promise<AxiosResponse['data']> {
    const apiKey = params.key || (await this.apiKeyService.getRandomApiKey())
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(`${this.apiUrl}/POIService/json/search`, {
        params: { ...params, key: apiKey },
      }),
    )
    return response.data
  }

  async extractAddress(params: {
    text: string
    correction?: number
    censor?: number
    locale?: string
    key?: string
  }): Promise<AxiosResponse['data']> {
    const apiKey = params.key || (await this.apiKeyService.getRandomApiKey())
    const response: AxiosResponse = await firstValueFrom(
      this.httpService.get(
        `${this.baseUrl}/smartsearch/json/extract_address/v2`,
        { params: { ...params, key: apiKey } },
      ),
    )
    return response.data
  }
}
