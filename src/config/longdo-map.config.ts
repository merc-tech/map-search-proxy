import { register } from 'module'
import { registerAs } from '@nestjs/config'
import { sample } from 'lodash'

export default registerAs('longdo-map', () => ({
  randomApiKey: () => sample(process.env.LONGDO_MAP_API_KEY?.split(',')) || '',
}))
