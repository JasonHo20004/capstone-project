// =============================================================================
// Authentication Middleware - Shared JWT verification
// =============================================================================

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types/index.js";
import { UnauthorizedError, ForbiddenError, AppError } from "./error.middleware.js";

// Extend Express Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Verify JWT token and attach user to request
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("Access token required"));
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return next(new AppError("Server configuration error: ACCESS_TOKEN_SECRET not defined", 500));
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};

/**
 * Require specific role(s)
 */
export const requireRole = (...roles: (UserRole | null)[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError("Authentication required"));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
};

/**
 * Require administrator role
 */
export const requireAdmin = requireRole(UserRole.ADMINISTRATOR);

/**
 * Require course seller role
 */
export const requireSeller = requireRole(UserRole.COURSESELLER);

/**
 * Optional authentication - attaches user if token present, but doesn't require it
 */
export const optionalAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next();
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
    req.user = decoded;
  } catch {
    // Token invalid, but we don't block the request
  }

  next();
};
