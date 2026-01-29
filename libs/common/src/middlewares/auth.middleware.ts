// =============================================================================
// Authentication Middleware - Shared JWT verification
// =============================================================================

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types/index.js";

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
    res.status(401).json({ success: false, error: "Access token required" });
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    res.status(500).json({ success: false, error: "Server configuration error" });
    return;
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ success: false, error: "Invalid or expired token" });
  }
};

/**
 * Require specific role(s)
 */
export const requireRole = (...roles: (UserRole | null)[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ success: false, error: "Insufficient permissions" });
      return;
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
    next();
    return;
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  if (!accessTokenSecret) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, accessTokenSecret) as JwtPayload;
    req.user = decoded;
  } catch {
    // Token invalid, but we don't block the request
  }

  next();
};
