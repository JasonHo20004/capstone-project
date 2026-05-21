import { databaseService } from "../../services/database.service.js";
import type { PlacementQuestion } from "../../../generated/prisma/index.js";

interface PickFilter {
  section: number;
  difficulty?: string;
  type?: string;
  skillTagPrefix?: string;
  count: number;
}

export class PlacementRepository {
  async pickRandom(filter: PickFilter): Promise<PlacementQuestion[]> {
    const prisma = databaseService.getClient();
    const where: Record<string, unknown> = {
      section: filter.section,
      isActive: true,
    };
    if (filter.difficulty) where.difficulty = filter.difficulty;
    if (filter.type) where.type = filter.type;
    if (filter.skillTagPrefix) {
      where.skillTag = { startsWith: filter.skillTagPrefix };
    }

    const candidates = await prisma.placementQuestion.findMany({ where });
    return shuffle(candidates).slice(0, filter.count);
  }

  async findByIds(ids: string[]): Promise<PlacementQuestion[]> {
    const prisma = databaseService.getClient();
    return prisma.placementQuestion.findMany({ where: { id: { in: ids } } });
  }

  async findActiveSession(userId: string) {
    const prisma = databaseService.getClient();
    return prisma.placementSession.findFirst({
      where: { userId, status: "in_progress" },
      orderBy: { createdAt: "desc" },
    });
  }
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const placementRepository = new PlacementRepository();
