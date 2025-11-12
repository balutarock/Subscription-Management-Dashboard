import { Server } from "http";
import app from "./app";
import envConfig from "./configurations/env-config";
import { logger } from "./modules/logger";

let server: Server;

(async function () {
  server = app.listen(envConfig.port, () => {
    logger.info(`Listening to port ${envConfig.port} in ${envConfig.env} mode`);
  });
})();

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: unknown) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
