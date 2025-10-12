import type { Response, NextFunction, Request } from "express";
import jwt,{TokenExpiredError} from "jsonwebtoken";
import type { UserRole } from "@/../generated/prisma";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => { 
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("JWT Access Token Secret is not defined.");
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
     if (err) {
      if (err instanceof TokenExpiredError) {
        res.status(401).json({
          message: "Unauthorized: Token has expired",
          code: "TOKEN_EXPIRED", 
        });
      } else {
        res.status(403).json({ message: "Forbidden: Invalid token" });
      }
    } else {
      req.user = decoded as { userId: string; role: UserRole };
      next();
    }
  });
};


export const checkRole = (allowedRoles: UserRole[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => { 
    if (!req.user || !req.user.role) {
      res.status(403).json({ message: "Forbidden: User role not found" });
      return;
    }

    const hasPermission = allowedRoles.includes(req.user.role);

    if (!hasPermission) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }

    next();
  };
};