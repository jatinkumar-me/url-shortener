import { Schema, model, Types, Document } from "mongoose";

export interface IURLTracking extends Document {
  urlId: Types.ObjectId;
  ipAddress: string,
  userAgent: string,
}

const urlTrackingSchema = new Schema<IURLTracking>(
  {
    urlId: {
      type: Schema.Types.ObjectId,
      ref: "URL",
      index: true,
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: true,
    },
  }
);

const URLTrackingModel = model<IURLTracking>("URLTracking", urlTrackingSchema);

export default URLTrackingModel;
