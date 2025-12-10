import { databaseService } from '@/services/database.service';
import type { MediaAsset, MediaType } from '@prisma/client';

export class MediaAssetRepository {
  private prisma = databaseService.getClient();

  async create(data: {
    assetType: MediaType;
    assetUrl: string;
    lessonId: string;
  }): Promise<MediaAsset> {
    const createData: any = {
      assetType: data.assetType,
      assetUrl: data.assetUrl,
      lessonId: data.lessonId,
    };

    return this.prisma.mediaAsset.create({
      data: createData,
    });
  }

  async findByLessonId(lessonId: string): Promise<MediaAsset[]> {
    return this.prisma.mediaAsset.findMany({
      where: { lessonId },
    });
  }

  async findByLessonIdAndType(
    lessonId: string,
    assetType: MediaType
  ): Promise<MediaAsset[]> {
    return this.prisma.mediaAsset.findMany({
      where: {
        lessonId,
        assetType,
      },
    });
  }

  async findById(id: string): Promise<MediaAsset | null> {
    return this.prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        lesson: true,
      },
    });
  }

  async update(
    id: string,
    data: {
      assetUrl?: string;
    }
  ): Promise<MediaAsset> {
    const updateData: any = {};
    if (data.assetUrl !== undefined) updateData.assetUrl = data.assetUrl;

    return this.prisma.mediaAsset.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.mediaAsset.delete({
      where: { id },
    });
  }

  async deleteByLessonId(lessonId: string): Promise<void> {
    await this.prisma.mediaAsset.deleteMany({
      where: { lessonId },
    });
  }
}

