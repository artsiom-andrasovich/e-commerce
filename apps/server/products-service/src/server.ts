import { env, logger } from "@configs";
import mongoose from "mongoose";
import app from "./app";

const start = async () => {
  const PORT = env.PORT || 3001;
  try {
    await mongoose.connect(env.MONGO_URL);

    app.listen(PORT, () => {
      logger.info(`Products service started on port = ${PORT}`);
    });
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};

start();
