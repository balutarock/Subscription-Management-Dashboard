import { NextFunction, Request, Response } from "express";

/**
 * Express middleware to monitor and log slow requests
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function requestPerformanceMonitor(logger: any, thresholdMs = 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    // Once the response is sent, log the duration if it's above threshold
    res.on("finish", () => {
      const duration = Date.now() - start;

      if (duration > thresholdMs) {
        logger.warn(`Slow request: ${req.method} ${req.originalUrl}`, {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          durationMs: duration,
          thresholdMs,
          correlationId: req.headers["x-correlation-id"] || req.headers["x-request-id"],
        });
      }
    });

    next();
  };
}
