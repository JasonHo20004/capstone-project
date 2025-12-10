import { databaseService } from "@/services/database.service";
import type { Tag } from "@prisma/client";
import type { CreateTagInput } from "@/modules/flashcards/dtos/tag.dto";
export class TagRepository {
  private prisma = databaseService.getClient();

    public async getAllTags(): Promise<Tag[]> {
    return this.prisma.tag.findMany()
  }
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
  public async deleteTag(id: string): Promise<Tag> {
    return this.prisma.tag.delete({
      where: {
        id: id,
      },
    });
  }
  public async findTagById(id: string): Promise<Tag | null> {
    return this.prisma.tag.findFirst({
      where: { id },
    });
  }
}
