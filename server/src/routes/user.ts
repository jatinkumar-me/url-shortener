import { Router } from "express";
import { login, register } from "../handlers/user";

export const userRouter = Router();

userRouter.post("/login", login);
userRouter.post("/register", register);
