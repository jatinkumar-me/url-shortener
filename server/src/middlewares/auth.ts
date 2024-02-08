import { type Request, type Response, type NextFunction } from "express";
import { UnauthorizedError } from "../utils/errors";
import { verify } from "jsonwebtoken";

export type AuthenticatedRequest = {
  user?: {
    id: number;
  };
} & Request;

export default async function auth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.accesstoken as string;
    if (!token) throw new UnauthorizedError("Unauthorized");
    const decodedToken = verify(token, process.env.JWT_SECRET!) as string;
    req.user = { id: parseInt(decodedToken) };
    next();
  } catch (error) {
    next(error);
  }
}
