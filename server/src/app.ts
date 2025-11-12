import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import { ApiError, errorConverter, errorHandler } from "./modules/errors/index";
import {
  errorHandler as apiErrorHandler,
  correlationIdMiddleware,
  errorLoggerMiddleware,
  requestBodyLoggerMiddleware,
  requestPerformanceMonitor,
  successHandler,
} from "./modules/logger";
import routes from "./routes/api/index";

const app: Express = express();

// Add correlation ID first to ensure all requests are tracked
app.use(correlationIdMiddleware);

// Request logging
app.use(successHandler);
app.use(apiErrorHandler);

// Performance monitoring
app.use(requestPerformanceMonitor);

// set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      frameSrc: ["'self'", "https://view.officeapps.live.com"],
    },
  })
);

// enable cors
app.use(cors());
// app.options("*", cors());

// parse json request body
app.use(express.json({ limit: "10mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Add request body logging after body parsers
app.use(requestBodyLoggerMiddleware);

// v1 api routes
app.use("/api", routes);

app.get("/health", (_req, res: Response) => {
  res.send({ status: "ok" });
});

app.use((_req: Request, _res: Response, next: (arg0: ApiError) => void) => {
  next(new ApiError(404, "Not found"));
});

// Error logging
app.use(errorLoggerMiddleware);

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
