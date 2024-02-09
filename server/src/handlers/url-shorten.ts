import { Response, NextFunction, Request } from "express";
// import { AuthenticatedRequest } from "../middlewares/auth";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors";
import URLModel, { IURL } from "../models/url";
import { Types } from "mongoose";
import URLTrackingModel from "../models/url-tracking";
import { randomBytes } from "crypto";
import { asyncLocalStorage } from "../middlewares/auth";

export async function checkUniquenessHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { shortUrl } = req.query;
    if (!shortUrl || typeof shortUrl != "string" || shortUrl === "") {
      throw new BadRequestError("short url is missing")
    }

    const urlExists = await checkURLExistence(shortUrl)

    res.status(200).json(urlExists);
  } catch (err) {
    next(err)
  }
}

type CreateURLHandlerRequestBody = {
  url: string,
  shortUrl?: string,
  description?: string,
}

// export async function createUrlHandler(req: AuthenticatedRequest, res: Response, next: NextFunction) {
export async function createUrlHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const payload = asyncLocalStorage.getStore();
    const { url, description }: CreateURLHandlerRequestBody = req.body;
    let { shortUrl }: CreateURLHandlerRequestBody = req.body

    if (!shortUrl) {
      shortUrl = generateRandomBase64(5);
    }

    const urlExists = await checkURLExistence(shortUrl);
    if (urlExists.exists) {
      throw new ConflictError("short url already exists");
    }

    const shortenedUrl = new URLModel({
      shortUrl,
      url,
      description,
      userId: payload?.userId,
    });

    await shortenedUrl.save();
    res.status(201).json({
      message: "success",
      data: shortenedUrl.toJSON()
    })
  } catch (err) {
    next(err)
  }
}

export async function redirectURLHandler(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers["user-agent"] ?? "";
  const ipAddress = req.ip;

  try {
    const shortUrl = req.params.shortUrl;
    if (!shortUrl) {
      throw new BadRequestError("short url missing");
    }

    const urlDocument = await URLModel.findOne({ shortUrl });
    if (!urlDocument) {
      throw new NotFoundError("url not found!");
    }

    res.redirect(urlDocument.url);
    recordURLHit(urlDocument._id, ipAddress, userAgent);
  } catch (err) {
    next(err)
  }
}

export async function fetchURLSHandler(_req: Request, res: Response, next: NextFunction) {
  try {
    const payload = asyncLocalStorage.getStore();
    const urls = await URLModel.find({ userId: payload?.userId });
    res.status(200).json(urls);
  } catch (err) {
    next(err)
  }
}

type PatchURLHandlerRequestBody = {
  _id: string,
  payload: IURL
}

export async function patchURLHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { _id, payload }: PatchURLHandlerRequestBody = req.body
    const userId = asyncLocalStorage.getStore()?.userId;

    if (!_id) {
      throw new BadRequestError("urlId is required");
    }

    const result = await URLModel.updateOne({ userId, _id }, {
      $set: payload
    })

    return res.status(200).json(result)
  } catch (err) {
    next(err)
  }
}

function generateRandomBase64(length: number): string {
  const randomBytesBuffer = randomBytes(Math.ceil((length * 3) / 4));
  return randomBytesBuffer.toString('base64').slice(0, length);
}

async function recordURLHit(urlId: Types.ObjectId, ipAddress: string, userAgent: string) {
  const urlTracking = new URLTrackingModel({
    urlId,
    ipAddress,
    userAgent
  });
  await urlTracking.save();
}

// async function getURLTrackingData(userId: Types.ObjectId, urlId: Types.ObjectId, startDate: Date, endDate: Date) {
//   const pipeline: PipelineStage[] = [
//     {
//       $match: {
//         userId: userId,
//         urlId: urlId,
//       }
//     },
//     {
//       $group
//     }
//   ]
//   await URLTrackingModel.aggregate({
//   })
// }

type URLExists = {
  exists: true,
  url: string
} | {
  exists: false
}

async function checkURLExistence(shortUrl: string): Promise<URLExists> {
  const url = await URLModel.findOne({ shortUrl });
  if (url === null) {
    return {
      exists: false,
    };
  }
  return {
    exists: true,
    url: url.url
  };
}
