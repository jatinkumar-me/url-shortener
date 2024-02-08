import { connect } from "mongoose";
import app from "./app";
import logger from "./utils/logger";

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT ?? 3000;

(async () => {
  try {
    if (!MONGODB_URI) {
      logger.error("MONGODB_URI not setup exiting...")
      return;
    }

    await connect(MONGODB_URI);

    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
  }
})();
