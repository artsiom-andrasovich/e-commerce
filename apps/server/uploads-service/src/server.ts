import dotenv from "dotenv";
import app from "./app";
import { env } from "./configs/env";
import { logger } from "./configs/logger";

const start = async () => {
  try {
    app.listen(env.PORT, () => {
      logger.info(`Upload service started on port = ${env.PORT}`);
    });
  } catch (e) {
    logger.error(e);
  }
};

start();
