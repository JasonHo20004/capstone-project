// =============================================================================
// Premium Feature Gate Middleware
// Calls payment-service to verify user has access to premium features
// =============================================================================

import { Request, Response, NextFunction } from "express";

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:3005";

/**
 * Middleware factory: checks if user has access to a specific premium feature.
 * Extracts userId from req.body.userId or JWT token in Authorization header.
 * Calls payment-service's internal checkFeatureAccess endpoint.
 */
export function requirePremiumFeature(feature: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract userId from body, query, or JWT
      let userId = req.body?.userId;

      if (!userId) {
        // Try extracting from JWT
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith("Bearer ")) {
          try {
            const token = authHeader.split(" ")[1];
            const payload = JSON.parse(
              Buffer.from(token.split(".")[1], "base64").toString()
            );
            userId = payload.sub || payload.userId || payload.id;
          } catch {
            // JWT parse failed
          }
        }
      }

      if (!userId) {
        res.status(401).json({
          success: false,
          error: "Authentication required to access this feature",
        });
        return;
      }

      // Call payment-service internal endpoint (no JWT required)
      const response = await fetch(
        `${PAYMENT_SERVICE_URL}/api/subscriptions/internal/check-access/${feature}?userId=${userId}`
      );

      if (!response.ok) {
        res.status(403).json({
          success: false,
          error: `Premium feature "${feature}" requires an active Pro subscription`,
          code: "PREMIUM_REQUIRED",
          feature,
        });
        return;
      }

      const result = await response.json();

      if (!result.data?.hasAccess) {
        res.status(403).json({
          success: false,
          error: `Premium feature "${feature}" requires an active Pro subscription`,
          code: "PREMIUM_REQUIRED",
          feature,
        });
        return;
      }

      next();
    } catch (error) {
      console.error(`❌ [PremiumGate] Feature check failed for "${feature}":`, error);
      // Fail-open: allow access on error to prevent blocking users during payment-service downtime
      next();
    }
  };
}
