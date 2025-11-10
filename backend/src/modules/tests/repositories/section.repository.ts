import { databaseService } from "@/services/database.service";
import type { Section } from "@/../generated/prisma";

export class SectionRepository {
  private prisma = databaseService.getClient();

  async findSectionByTest( testId: string ): Promise<Section[]> {
    return this.prisma.section.findMany({
      where: { testId }
    });
  }
  public async findSectionByIds_InTest(
      testId: string,
      sectionId: string[]
    ): Promise<Section[]> {
      return this.prisma.section.findMany({
        where: {
          testId: testId,
          id: { in: sectionId },
        },
      });
    }
}
