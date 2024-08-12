import { Controller, Get } from '@nestjs/common';
import { FestivalService } from '../services/app.service';

@Controller('api/v1/festivals')
export class FestivalController {
  constructor(private readonly festivalService: FestivalService) {}

  @Get()
  async getFestivals() {
    return this.festivalService.getFestivalData();
  }
}
