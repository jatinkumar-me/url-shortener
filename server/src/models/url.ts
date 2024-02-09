import { Schema, model, Types, Document } from "mongoose";

export interface IURL extends Document{
  userId: Types.ObjectId;
  url: string;
  description?: string;
  shortUrl: string;
  hitCount: number;
}

const urlSchema = new Schema<IURL>(
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

const URLModel = model<IURL>("URL", urlSchema);

export default URLModel;
