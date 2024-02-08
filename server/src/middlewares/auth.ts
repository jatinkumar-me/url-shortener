import { type Request, type Response, type NextFunction } from "express";
import { InternalServerError, UnauthorizedError } from "../utils/errors";
import { JwtPayload, verify } from "jsonwebtoken";

export type AuthenticatedRequest = {
  payload: AuthenticatedRequestPayload,
} & Request

interface AuthenticatedRequestPayload extends JwtPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET;

export default async function auth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    if (!JWT_SECRET) {
      throw new InternalServerError('Authentication not setup');
    }

    const authHeader = req.headers["authorization"];
    if (!authHeader)
      throw new UnauthorizedError("authentication token not provided");

    const token = authHeader.split(" ")[1];
    if (!token)
      throw new UnauthorizedError("invalid authentication token");

    const decoded = verify(token, JWT_SECRET);

    req.payload.userId = decoded as string;
    next();
  } catch (error) {
    next(error);
  }
}
