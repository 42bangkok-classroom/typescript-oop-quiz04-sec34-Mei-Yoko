import { Controller, Get } from '@nestjs/common';
import { MissionService } from './mission.service';

@Controller('missions')
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get('summary')
  getMissionSummary() {
    return this.missionService.getSummary();
  }

  @Get()
  findAll() {
    return this.missionService.findAll();
  }
}