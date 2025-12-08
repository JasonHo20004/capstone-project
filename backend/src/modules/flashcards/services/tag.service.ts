import { TagRepository } from "@/modules/flashcards/repositories/tag.repository";
import type { CreateTagInput } from "@/modules/flashcards/dtos/tag.dto";
import type { Tag } from "@prisma/client";

export class TagService {
  private tagRepository = new TagRepository();

  public async getAllTags(): Promise<Tag[]> {
    const tags = await this.tagRepository.getAllTags();

    return tags;
  }
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

  public async deleteTag(id: string): Promise<void> {
  try {
    await this.tagRepository.deleteTag(id);
  } catch (error:any) { 
      if (error.code === 'P2025') {
        throw new Error('Flashcard deck not found or user does not have permission.');
      }
    throw error;
  }
}
}
