import type { Request, Response } from "express";
import { TagService } from "@/modules/flashcards/services/tag.service";
import type {
  CreateTagInput,
  UpdateTagInput,
  DeleteTagInput,
} from "../dtos/tag.dto";

export class TagController {
  private tagService = new TagService();
public getAllTags = async (
    _req: Request,
    res: Response
  ): Promise<void> => {
    try {
     
      const tags = await this.tagService.getAllTags();

      res.status(200).json({
        success: true,
        message: "Lấy tất cả tag thành công",
        data: tags,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lấy tất cả tag thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };

  public createTag = async (
    req: Request<{}, {}, CreateTagInput["body"]>,
    res: Response
  ): Promise<void> => {
    try {
      const tagData = req.body;
      const newTag = await this.tagService.createTag(tagData);

      res.status(200).json({
        success: true,
        message: "Tạo tag thành công",
        data: newTag,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Tạo tag thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public updateTag = async (
    req: Request<UpdateTagInput["params"], {}, CreateTagInput["body"]>,
    res: Response
  ): Promise<void> => {
    try {
      const { name } = req.body;
      const { tagId } = req.params;
      const updatedTag = await this.tagService.updateTag(tagId, { name });

      res.status(200).json({
        success: true,
        message: "Cập nhật tag thành công",
        data: updatedTag,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Cập nhật tag thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
  public deleteTag = async (
    req: Request<DeleteTagInput["params"]>,
    res: Response
  ): Promise<void> => {
    try {
     
      const { tagId } = req.params;
      await this.tagService.deleteTag(tagId);

      res.status(200).json({
        success: true,
        message: "Xóa tag thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Xóa tag thất bại",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
