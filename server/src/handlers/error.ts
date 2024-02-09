import { NextFunction, Request, Response } from "express";
import { ServerError } from "../utils/errors";
import logger from "../utils/logger";

export default function errorHandler(
  err: Error | ServerError,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error(err.message);

  let statusCode = 500;
  if (err instanceof ServerError) {
    statusCode = err.statusCode;
  }

  return res.status(statusCode).json({
    error: err.message,
  });
}

