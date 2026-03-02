import { Injectable } from "@nestjs/common";
import { IMission } from "./mission.interface";
import { readFileSync } from "fs";

@Injectable()
export class MissionService {
  private readonly mission = [
    { id: 1, codename: "OPERATION_STORM", status: "ACTIVE" },
    { id: 2, codename: "SILENT_SNAKE", status: "COMPLETED" },
    { id: 3, codename: "RED_DAWN", status: "FAILED" },
    { id: 4, codename: "BLACKOUT", status: "ACTIVE" },
    { id: 5, codename: "ECHO_FALLS", status: "COMPLETED" },
    { id: 6, codename: "GHOST_RIDER", status: "COMPLETED" },
  ];

  getSummary() {
    const res = {
      ACTIVE: 0,
      COMPLETED: 0,
      FAILED: 0,
    };
    for (let i = 0; i < this.mission.length; i++) {
      const data = this.mission[i];
      if (data.status in res) {
        res[data.status as keyof typeof res]++;
      }
    }
    return res;
  }

  create(mission: IMission) {
    const data = readFileSync("missions.json", "utf-8");
    const missions: IMission[] = JSON.parse(data);
    missions.push({...mission,
      id: (missions.length + 1).toString(),
      status: "ACTIVE",
      endDate: null,
    });
    return mission;
  }

  findAll() {
    const data = readFileSync("missions.json", "utf-8");
    const missions: IMission[] = JSON.parse(data);
    missions.map(d=>{
      let durationDays = -1
      if (d.startDate && d.endDate) {
        const start = new Date(d.startDate);
        const end = new Date(d.endDate);
        durationDays = (end.getTime() - start.getTime())/86400000;
      }
      return {
        ...d,
        durationDays
      }
    })
    return missions;
  }

  findOne(id: string, clearance: string = "STANDARD") {
    const data = readFileSync("missions.json", "utf-8");
    const missions: IMission[] = JSON.parse(data);
    const mission = missions.find((m) => m.id === id)!;
    if (!mission) {
      return null;
    } else if (mission.riskLevel == "HIGH") {
    if (clearance == "SECRET") {
      return {
        ...mission,
        targetName: "***REDACTED***",
      };
    } else if (clearance == "TOP_SECRET") {
      return mission;
    } else {
      return null;
    }
  }
    return mission;
  }
}