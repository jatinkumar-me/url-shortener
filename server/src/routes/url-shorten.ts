import { Router } from "express";
import {
  checkUniquenessHandler,
  createUrlHandler,
  fetchURLSHandler,
  patchURLHandler,
} from "../handlers/url-shorten";

export const urlRouter = Router();

urlRouter.post("/", createUrlHandler);
urlRouter.get("/", fetchURLSHandler);
urlRouter.patch("/", patchURLHandler);
urlRouter.get("/unique", checkUniquenessHandler);
