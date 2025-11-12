/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger } from "./core";
import { requestPerformanceMonitor as perLog } from "./performance";
import {
  correlationIdMiddleware,
  createRequestLogger,
  errorLoggerMiddleware as errLog,
} from "./http";
import config from "../../configurations/env-config";

// Create logger instance
const logger = createLogger({
  service: "api",
  env: config.env,
});

// Create HTTP request logging
const { successHandler, errorHandler } = createRequestLogger(logger);

const errorLoggerMiddleware = errLog(logger);
const requestPerformanceMonitor = perLog(logger);

/**
 * Middleware to log request body for all requests
 * Used when more detailed body logging is needed beyond what morgan provides
 */
const requestBodyLoggerMiddleware = (req: any, _res: any, next: any) => {
  // Skip logging for certain endpoints
  const skipBodyLogging = ["/health", "/v1/auth/login"].includes(req.path);

  if (!skipBodyLogging && req.body && Object.keys(req.body).length > 0) {
    // Create a safe copy of the body to avoid logging sensitive info
    const bodyCopy = { ...req.body };

    // Remove sensitive fields
    if (bodyCopy.password) bodyCopy.password = "[REDACTED]";
    if (bodyCopy.token) bodyCopy.token = "[REDACTED]";

    logger.debug(`Request body for ${req.method} ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      body: bodyCopy,
      correlationId:
        req.headers["x-correlation-id"] || req.headers["x-request-id"],
      userId: req.user?.id,
    });
  }

  next();
};

// Export for use in app.ts
export {
  logger,
  successHandler,
  errorHandler,
  correlationIdMiddleware,
  errorLoggerMiddleware,
  requestBodyLoggerMiddleware,
  requestPerformanceMonitor,
};
