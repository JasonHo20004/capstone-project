import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod'; // Dùng AnyZodObject linh hoạt hơn

// Khai báo tường minh middleware sẽ trả về `void`
export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => { // <-- Thêm : void ở đây
    try {
      // Handle multipart/form-data: ensure body is an object (multer parses text fields into req.body)
      // When multer processes FormData, text fields are parsed into req.body as an object
      // If req.body is undefined or null, use empty object
      let body: any = {};
      if (req.body) {
        if (typeof req.body === 'object' && !Array.isArray(req.body)) {
          body = req.body;
        } else if (typeof req.body === 'string') {
          // This shouldn't happen with multer, but handle it just in case
          try {
            body = JSON.parse(req.body);
          } catch {
            body = {};
          }
        }
      }
      
      const parsed = schema.parse({
        body: body,
        query: req.query,
        params: req.params,
      });
      req.body = parsed.body as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Bây giờ nếu bạn thêm 'return' ở đây, TypeScript sẽ báo lỗi ngay
        // vì hàm được khai báo là void
        res.status(400).json({
          message: 'Invalid request data',
          errors: error.issues,
        });
      } else {
        next(error);
      }
    }
  };
};