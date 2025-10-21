import { TagRepository } from "@/modules/flashcards/repositories/tag.repository";
import type { CreateTagInput } from "@/modules/flashcards/dtos/tag.dto";
import type { Tag } from "@/../generated/prisma";

export class TagService {
  private tagRepository = new TagRepository();

  public async createTag(tagData: CreateTagInput["body"]): Promise<Tag> {
    const newTag = await this.tagRepository.createTag(tagData);

    return newTag;
  }

  public async updateTag(
    id: string,
    updateData: {
      name: string;
    }
  ): Promise<Tag> {
    try {
      const updateTag = await this.tagRepository.updateTag(id, updateData);
      return updateTag;
    } catch {
      throw Error("Can not find tagId");
    }
  }
}
