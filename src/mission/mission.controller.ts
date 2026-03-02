import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { MissionService } from "./mission.service";

@Controller("missions")
export class MissionController {
  constructor(private readonly missionService: MissionService) {}

  @Get()
  getMissions() {
    return this.missionService.findAll();
  }

  @Get("summary")
  getSummary() {
    return this.missionService.getSummary();
  }

  @Get(":id")
  getMissionById(
    @Param("id") id: string,
    @Query("clearance") clearance?: string,
  ) {
    return this.missionService.findOne(id, clearance);
  }

  @Post()
  createMission(
    @Body()
    mission: {
      codename: string;
      targetName: string;
      riskLevel: string;
      startDate: string;
      id: string;
      status: string;
      endDate: string;
    },
  ) {
    return this.missionService.create(mission);
  }
}