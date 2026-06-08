import { SystemActions } from "@/lib/SystemActions";
import mongoose, { Schema, Document, Types,model, models, SchemaType  } from "mongoose";

export interface IMessage extends Document {
   chatId: Types.ObjectId;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image" | "system";
  seenBy: {
    userId: string;
    seenAt: Date;
  }[];
  system?: {
    action: SystemActions;
    text: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const schema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    image: {
      url: String,
      publicId: String,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "system"],
      default: "text",
    },
   system: {
      action: {
        type: String,
        enum: Object.values(SystemActions),
      },
      text: {
        type: String,
      },
    },

    seenBy: [
      {
        userId: {
          type: String,
          required: true,
        },

        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Message = models?.Message || model<IMessage>("Message", schema);

export default Message;