import mongoose, { Schema, model, models } from "mongoose";

export interface ISession {
  userId:  mongoose.Types.ObjectId;
  userAgent: string;
  ip: string;
  expiresAt: Date;
  sessionToken:string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
const sessionSchema = new Schema<ISession>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    sessionToken: {
    type: String,
    required: true,
  },
    ip: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Session = models?.Session || model<ISession>("Session", sessionSchema);
export default Session;
