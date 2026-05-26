// =============================================================================
// Error Handler Middleware
// =============================================================================

import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  /** Optional machine-readable error code (e.g. "FINAL_TEST_EXISTS"). */
  public readonly code?: string;
  /** Optional structured payload sent back to the client alongside the error. */
  public readonly data?: unknown;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    options?: { code?: string; data?: unknown },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = options?.code;
    this.data = options?.data;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = "Bad request") {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict", options?: { code?: string; data?: unknown }) {
    super(message, 409, true, options);
  }
}

export class TooManyRequestsError extends AppError {
  public readonly retryAfterSeconds?: number;

  constructor(message: string = "Too many requests", retryAfterSeconds?: number) {
    super(message, 429);
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError) {
    if (err instanceof TooManyRequestsError && err.retryAfterSeconds) {
      res.setHeader("Retry-After", String(err.retryAfterSeconds));
    }
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      ...(err.code !== undefined ? { code: err.code } : {}),
      ...(err.data !== undefined ? { data: err.data } : {}),
      ...(err instanceof TooManyRequestsError && err.retryAfterSeconds
        ? { retryAfterSeconds: err.retryAfterSeconds }
        : {}),
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }

  console.error("Unhandled error:", err);
  
  res.status(500).json({
    success: false,
    error: "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      message: err.message,
      stack: err.stack,
    }),
  });
};

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
