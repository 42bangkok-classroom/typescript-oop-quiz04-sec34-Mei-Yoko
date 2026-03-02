import { Injectable } from '@nestjs/common';
import { IMission } from './mission.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MissionService {
  private readonly missions = [
    { id: 1, codename: 'OPERATION_STORM', status: 'ACTIVE' },
    { id: 2, codename: 'SILENT_SNAKE', status: 'COMPLETED' },
    { id: 3, codename: 'RED_DAWN', status: 'FAILED' },
    { id: 4, codename: 'BLACKOUT', status: 'ACTIVE' },
    { id: 5, codename: 'ECHO_FALLS', status: 'COMPLETED' },
    { id: 6, codename: 'GHOST_RIDER', status: 'COMPLETED' },
  ];

  getSummary(): Record<string, number> {
    return this.missions.reduce((acc, mission) => {
      if (!acc[mission.status]) {
        acc[mission.status] = 0;
      }
      acc[mission.status]++;
      return acc;
    }, {} as Record<string, number>);
  }

  findAll(): (IMission & { durationDays: number })[] {
    const filePath = path.join(process.cwd(), 'data', 'missions.json');

    const rawData = fs.readFileSync(filePath, 'utf-8');
    const missions: IMission[] = JSON.parse(rawData);

    return missions.map((mission) => {
      let durationDays = -1;

      if (mission.endDate) {
        const start = new Date(mission.startDate).getTime();
        const end = new Date(mission.endDate).getTime();

        const diffMs = end - start;
        durationDays = diffMs / (1000 * 60 * 60 * 24);
      }

      return {
        ...mission,
        durationDays,
      };
    });
  }
}