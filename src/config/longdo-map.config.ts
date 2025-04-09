import { registerAs } from "@nestjs/config";
import { sample } from "lodash";
import { register } from "module";

export default registerAs('longdo-map', () => ({
    randomApiKey: () => sample(process.env.LONGDO_MAP_API_KEY?.split(',')) || ""
}));