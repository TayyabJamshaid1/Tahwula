// models/Chat.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IChat extends Document {
  users: string[];
  isGroupChat: boolean;
  groupName?: string;
  groupImage?: {
    url: string;
    publicId: string;
  };
  admin?: string;
  latestMessage: {
    text: string;
    sender: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const schema: Schema<IChat> = new Schema(
  {
    users: [
      {
        type: String,
        required: true,
      },
    ],

    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: function (this: IChat) {
        return this.isGroupChat === true;
      },
    },
    groupImage: {
      url: String,
      publicId: String,
    },
    admin: {
      type: String,
    },

    latestMessage: {
      text: String,
      sender: String,
    },
  },
  {
    timestamps: true,
  },
);

const Chat = models?.Chat || model<IChat>("Chat", schema);

export default Chat;
