import { Injectable, NotFoundException } from '@nestjs/common';
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

  private readonly dataPath = path.join(
    process.cwd(),
    'data',
    'missions.json',
  );

  getSummary(): Record<string, number> {
    return this.missions.reduce<Record<string, number>>(
      (acc, mission) => {
        if (!acc[mission.status]) {
          acc[mission.status] = 0;
        }

        acc[mission.status]++;

        return acc;
      },
      {},
    );
  }

  private readMissions(): IMission[] {
    const raw = fs.readFileSync(this.dataPath, 'utf-8');

    return JSON.parse(raw) as IMission[];
  }

  findAll(): Array<IMission & { durationDays: number }> {
    const missions = this.readMissions();

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

  findOne(id: string, clearance = 'STANDARD'): IMission {
    const missions = this.readMissions();

    const mission = missions.find((m) => m.id === id);

    if (!mission) {
      throw new NotFoundException(`Mission with id ${id} not found`);
    }

    const result: IMission = { ...mission };

    const highRiskLevels = ['HIGH', 'CRITICAL'];

    const isHighRisk = highRiskLevels.includes(result.riskLevel);
    const hasTopClearance = clearance === 'TOP_SECRET';

    if (isHighRisk && !hasTopClearance) {
      result.targetName = '***REDACTED***';
    }

    return result;
  }
}