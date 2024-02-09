import Express from "express";

import { config } from "dotenv";
import cors from "cors";

// import logger from "./utils/logger";
import { userRouter } from "./routes/user";
import { urlRouter } from "./routes/url-shorten";
import errorHandler from "./handlers/error";

/**
 * Setting up environment variables
 **/
config();

const app = Express();

app.use(cors());

app.use("/static", Express.static("public"));

app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(Express.json());

/**
 * Setting up routes
 */
app.use("/user", userRouter)
app.use("/url", auth, urlRouter)
app.use(errorHandler);

export default app;
