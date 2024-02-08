import { Schema, model, Types } from "mongoose";

export interface IURLs {
  userId: Types.ObjectId;
  url: string;
  description?: string;
  shortUrl: string;
  hitCount: number;
}

const urlSchema = new Schema<IURLs>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    url: {
      type: String,
      required: true,
      maxlength: 400,
    },
    description: {
      type: String,
      required: false,
      maxlength: 600,
    },
    shortUrl: {
      type: String,
      required: true,
      maxlength: 20,
      index: true,
    },
    hitCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const URLModel = model<IURLs>("URL", urlSchema);

export default URLModel;
