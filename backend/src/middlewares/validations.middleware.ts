import type { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod'; // Dùng AnyZodObject linh hoạt hơn

// Khai báo tường minh middleware sẽ trả về `void`
export const validate = (schema: ZodObject) => {
  return (req: Request, res: Response, next: NextFunction): void => { // <-- Thêm : void ở đây
    try {
      const parsed = schema.parse({
        body: req.body,
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