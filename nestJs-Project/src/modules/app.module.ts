import { Module } from '@nestjs/common';
import { FestivalController } from '../controllers/app.controller';
import { FestivalService } from '../services/app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [FestivalController],
  providers: [FestivalService],
})
export class AppModule {}
