import winston from "winston";

export interface LoggerOptions {
  service: string;
  env?: string;
  level?: string;
}

/**
 * Creates a Winston logger instance with proper configuration
 */
export function createLogger(options: LoggerOptions) {
  const { service, env = "local" } = options;

  // Default level based on environment
  const level = options.level || (env === "production" ? "info" : "debug");

  // Define a consistent JSON format
  const jsonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  );

  const logger = winston.createLogger({
    level,
    defaultMeta: { service },
    format: jsonFormat,
    transports: [
      new winston.transports.Console({
        stderrLevels: ["error"],
      }),
    ],
  });

  return logger;
}

// Export log levels for reference
export const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};
