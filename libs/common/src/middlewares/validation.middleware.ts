// =============================================================================
// Validation Middleware using Zod
// =============================================================================

import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodError, ZodSchema, ZodIssue } from "zod";

export interface ValidationSchema {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

/**
 * Validate request against Zod schemas
 */
export const validate = (schema: ValidationSchema): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      if (schema.params) {
        const parsed = schema.params.parse(req.params);
        Object.assign(req.params, parsed);
      }
      if (schema.query) {
        const parsed = schema.query.parse(req.query);
        Object.assign(req.query, parsed);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        const errors = zodError.issues.map((e: ZodIssue) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.status(400).json({
          success: false,
          error: "Validation failed",
          details: errors,
        });
        return;
      }
      next(error);
    }
  };
};

// Common validation schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const uuidSchema = z.object({
  id: z.string().uuid(),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;
export type UuidParams = z.infer<typeof uuidSchema>;
