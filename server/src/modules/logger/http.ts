/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";

/**
 * Create HTTP request logging middleware powered by morgan
 */
export function createRequestLogger(logger: any) {
  // Add custom tokens
  morgan.token("correlation-id", (req: Request) => {
    return (req.headers["x-correlation-id"] as string) || (req.headers["x-request-id"] as string) || "-";
  });

  morgan.token("user-id", (req: Request) => {
    return (req as any).user?.id || "-";
  });

  morgan.token("message", (_req: Request, res: Response) => {
    return res.locals["errorMessage"] || "";
  });

  morgan.token("body", (req: Request) => {
    // Safely stringify the request body
    try {
      const bodyCopy = { ...req.body };

      // Remove sensitive data if needed
      if (bodyCopy.password) bodyCopy.password = "[REDACTED]";
      if (bodyCopy.token) bodyCopy.token = "[REDACTED]";

      return JSON.stringify(bodyCopy);
    } catch {
      return "[Body parsing error]";
    }
  });

  // Format strings with body information
  const successFormat =
    ":method :url :status - :response-time ms [cid::correlation-id] [uid::user-id] - body: :body";
  const errorFormat =
    ":method :url :status - :response-time ms [cid::correlation-id] [uid::user-id] - message: :message - body: :body";

  // Create morgan handlers
  const successHandler = morgan(successFormat, {
    skip: (_req: Request, res: Response) => {
      return res.statusCode >= 400;
    },
    stream: { write: (message: string) => logger.info(`HTTP: ${message.trim()}`) },
  });

  const errorHandler = morgan(errorFormat, {
    skip: (_req: Request, res: Response) => {
      return res.statusCode < 400;
    },
    stream: { write: (message: string) => logger.error(`HTTP: ${message.trim()}`) },
  });

  return {
    successHandler,
    errorHandler,
  };
}

/**
 * Middleware to add correlation ID header to track requests
 */
export function correlationIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers["x-correlation-id"] || req.headers["x-request-id"] || uuidv4();

  req.headers["x-correlation-id"] = correlationId as string;
  res.setHeader("x-correlation-id", correlationId);
  next();
}

/**
 * Middleware to log request body for all requests
 * Used when more detailed body logging is needed beyond what morgan provides
 */
export function requestBodyLoggerMiddleware(logger: any) {
  return (req: Request, _res: Response, next: NextFunction) => {
    // Skip logging for certain endpoints if needed
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
        correlationId: req.headers["x-correlation-id"] || req.headers["x-request-id"],
        userId: (req as any).user?.id,
      });
    }

    next();
  };
}

export function errorLoggerMiddleware(logger: any) {
  return (err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(`Request error: ${err.message}`, {
      method: req.method,
      url: req.originalUrl,
      correlationId: req.headers["x-correlation-id"] || req.headers["x-request-id"],
      userId: (req as any).user?.id,
      body: req.body, // Include request body in error logs
      error: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
    });
    next(err);
  };
}
