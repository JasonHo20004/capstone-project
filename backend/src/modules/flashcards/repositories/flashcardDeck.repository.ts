import { databaseService } from "@/services/database.service";
import type { FlashcardDeck } from "@/../generated/prisma";
// import type { CreateFlashcardDeckInput } from "@/modules/flashcards/dtos/flashcardDeck.dto";
export class FlashcardDeckRepository {
  private prisma = databaseService.getClient();

  public async createDeck(
    userId: string,
    deckData: any,
    tagIds: string[]
  ): Promise<FlashcardDeck> {
    
    return this.prisma.flashcardDeck.create({
      data: {
        ...deckData,
        userId,
        deckTags: {
          create: tagIds.map((id) => ({
            tagId:id
          })),
        },
      },
      include: {
        deckTags: {
          select: {
            tag: true,
          },
        },
      },
    });
  }
}
