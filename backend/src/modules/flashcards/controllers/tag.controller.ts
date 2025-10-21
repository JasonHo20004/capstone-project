import type { Request, Response } from 'express';
import { TagService } from '@/modules/flashcards/services/tag.service';
import type { CreateTagInput ,UpdateTagInput} from '../dtos/tag.dto';

export class TagController {
  private tagService = new TagService();  

  public createTag= async(req:Request<{},{},CreateTagInput['body']>, res: Response):Promise<void> =>{
    try {
      const tagData = req.body;
      const newTag = await this.tagService.createTag(tagData);
      
      res.status(200).json({
        success: true,
        message: 'Create Tag successfully',
        data: newTag,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create tag',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }
public updateTag= async(req:Request<UpdateTagInput['params'],{},CreateTagInput['body']>, res: Response):Promise<void> =>{
    try {
      const {name}= req.body
      const {tagId} = req.params
      const updatedTag = await this.tagService.updateTag(tagId,{name});
      
      res.status(200).json({
        success: true,
        message: 'Update tag successfully',
        data: updatedTag,
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update tag',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

};