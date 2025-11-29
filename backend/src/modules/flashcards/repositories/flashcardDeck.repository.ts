import { databaseService } from "@/services/database.service";
import type { FlashcardDeck } from "@/../generated/prisma";
import type { GetAllFlashcardDeckResponse } from "@/modules/flashcards/dtos/flashcardDeck.dto";
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
            tagId: id,
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

  public async updateDeck(
    id: string,
    updateData: {
      title?: string;
      description?: string | null;
      tagIds?: string[];
    },
    userId: string
  ): Promise<FlashcardDeck> {
    const { tagIds, ...otherData } = updateData;

    return this.prisma.flashcardDeck.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        ...otherData,
        ...(tagIds !== undefined && {
          deckTags: {
            deleteMany: {},
            create: tagIds.map((id) => ({
              tagId: id,
            })),
          },
        }),
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
  public async deleteDeck(id: string, userId: string): Promise<FlashcardDeck> {
    const deletedDeck = await this.prisma.flashcardDeck.delete({
      where: {
        id: id,
        userId: userId,
      },
    });

    return deletedDeck;
  }

  public async findFlashcardDeckById(id: string): Promise<FlashcardDeck | null> {
    return this.prisma.flashcardDeck.findUnique({
      where: { id: id },
    });
  }
  public async findFlashcardDeckByUserId(userId: string): Promise<GetAllFlashcardDeckResponse[]> {
    return this.prisma.flashcardDeck.findMany({
      where: {userId },
      include:{
        deckTags:{
          select:{
            tag:{
              select:{
                id:true,
                name:true
              }
            }
          }
        },
        user:{
          select:{
            fullName:true,
            email:true
          }
        }
      }
    });
  }
}
