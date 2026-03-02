import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { MissionService } from "./mission.service";
import * as missionInterface from "./mission.interface";

@Controller("missions")
export class MissionController {
  constructor(private readonly missionService: MissionService) {}
  @Get("summary")
  getSummary() {
    return this.missionService.getSummary();
  }
  @Get(":id")
  getMissionById(id: string, @Query("clearance") clearance?: string) {
    return this.missionService.findOne(id, clearance);
  }
  @Post()
  createMission(@Body() mission: missionInterface.IMission) {
    return this.missionService.create(mission);
  }
}