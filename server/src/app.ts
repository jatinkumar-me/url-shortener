import Express from "express";

import { config } from "dotenv";
import cors from "cors";

// import logger from "./utils/logger";
import { userRouter } from "./routes/user";
import { urlRouter } from "./routes/url-shorten";

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

// app.use(
//   (
//     err: Error | CustomError,
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): any => {
//     let statusCode = 500;
//     switch (err.constructor) {
//       case UnauthorizedError:
//         statusCode = 401;
//         break;
//       case DuplicateEntryError:
//         statusCode = 403;
//         break;
//       case InvalidDataError:
//         statusCode = 400;
//         break;
//       case NotFoundError:
//         statusCode = 404;
//         break;
//       case UnauthorizedError:
//         statusCode = 401;
//         break;
//       case AccountDisabledError:
//         statusCode = 409;
//         break;
//       case CustomError:
//         const customError = err as CustomError;
//         statusCode = customError.statusCode ?? 500;
//         break;
//       default:
//         statusCode = 500;
//         logger.error(err);
//         break;
//     }
//
//     if (req.path.includes("/api")) {
//       return res.status(statusCode).json({
//         error: err.message,
//       });
//     } else {
//       return res.render("partials/error", {
//         layout: "main",
//         statusCode,
//         message: err.message,
//         error: err,
//       });
//     }
//   }
// );
/**
 * Setting up routes
 */
app.use("/user", userRouter)
app.use("/url", auth, urlRouter)

export default app;
