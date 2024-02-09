import Express from "express";

import { config } from "dotenv";
import cors from "cors";

import { userRouter } from "./routes/user";
import { urlRouter } from "./routes/url-shorten";
import errorHandler from "./handlers/error";

/**
 * Setting up environment variables
 **/
config();

const app = Express();

app.use(cors());
app.use(Express.json());

/**
 * Setting up routes
 */
app.use("/user", userRouter)
app.use("/url", auth, urlRouter)
app.use(errorHandler);

export default app;
