import { registerAs } from "@nestjs/config";
import { register } from "module";

export default registerAs('longdo-map', () => ({
    apiKey: process.env.LONGDO_MAP_API_KEY?.split(',')[0] // random 1 of key
}));