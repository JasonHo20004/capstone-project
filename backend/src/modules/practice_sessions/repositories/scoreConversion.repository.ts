import { databaseService } from "@/services/database.service";

import type { ScoreConversion } from "@/../generated/prisma";
export class ScoreConversionRepository {
  private prisma = databaseService.getClient();

  public async findScoreConversion(testTypeId:string): Promise<ScoreConversion[]> {
    return this.prisma.scoreConversion.findMany({
        where:{englishTestTypeId: testTypeId}
    });
  }
}
