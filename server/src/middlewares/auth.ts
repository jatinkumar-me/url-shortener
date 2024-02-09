import { NextFunction, type Request, Response } from "express";
import { InternalServerError, UnauthorizedError } from "../utils/errors";
import { JwtPayload, verify } from "jsonwebtoken";
import { AsyncLocalStorage } from "async_hooks";

interface AuthPayload {
  userId: string;
}

export const asyncLocalStorage =
  new AsyncLocalStorage<AuthPayload>();

/**
 * auth middleware attaches userId as paylaod to request object, after decoding
 * the jwt from the header
 */
export default function auth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new InternalServerError("Authentication not setup");
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader)
      throw new UnauthorizedError("authentication token not provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new UnauthorizedError("invalid authentication token");

    const decoded = verify(token, JWT_SECRET);

    asyncLocalStorage.run(
      {
        userId: (decoded as AuthPayload).userId,
      },
      next,
      "route"
    );
  } catch (error) {
    next(error);
  }
}
