import { databaseService } from "@/services/database.service";
import type { Tag } from "@/../generated/prisma";
import type { CreateTagInput } from "@/modules/flashcards/dtos/tag.dto";
export class TagRepository {
  private prisma = databaseService.getClient();

  public async createTag(tagData: CreateTagInput["body"]): Promise<Tag> {
    return this.prisma.tag.create({
      data: tagData,
    });
  }

  public async updateTag(
    id: string,
    updateData: {
      name: string;
    }
  ): Promise<Tag> {
    return this.prisma.tag.update({
      where: { id },
      data: updateData,
    });
  }
}
