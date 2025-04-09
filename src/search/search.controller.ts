import { Controller, Get } from "@nestjs/common";

@Controller('search')
export class SearchController {
    @Get()
    async searchPlace() {
        return {
            message: "Search Place"
        };
    }
}