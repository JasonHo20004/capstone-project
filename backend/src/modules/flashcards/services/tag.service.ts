import { TagRepository } from "@/modules/flashcards/repositories/tag.repository";
import type { CreateTagInput } from "@/modules/flashcards/dtos/tag.dto";
import type { Tag } from "@/../generated/prisma";

export class TagService {
  private tagRepository = new TagRepository();

  public async createTag(
    tagData:CreateTagInput['body']
  ): Promise<Tag> {

    const newTag = await this.tagRepository.createTag(
      tagData
    );

    return newTag;
  }
}
