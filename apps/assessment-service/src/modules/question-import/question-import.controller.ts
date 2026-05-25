// =============================================================================
// Question Import Controller
// =============================================================================

import { Request, Response, NextFunction } from "express";
import {
  questionImportService,
  FileValidationError,
} from "./question-import.service.js";

export class QuestionImportController {
  public async parseFile(req: Request, res: Response, next: NextFunction) {
    try {
      const file = (req as unknown as { file?: Express.Multer.File }).file;
      if (!file) {
        res.status(400).json({ success: false, error: "Vui lòng tải lên một file." });
        return;
      }

      const result = await questionImportService.parseFile(file);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      if (err instanceof FileValidationError) {
        res.status(err.status).json({ success: false, error: err.message });
        return;
      }
      next(err);
    }
  }
}

export const questionImportController = new QuestionImportController();
