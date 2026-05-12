// models/Chat.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
    isGroupChat: boolean;
    groupName?: string;
    groupAdmin?: string;
    users: string[];
    latestMessage?: {
        text: string,
        sender: string
    }
    createdAt: Date;
    updatedAt: Date;
}

const schema: Schema<IChat> = new Schema(
    {
        isGroupChat: {
            type: Boolean,
            default: false
        },
        groupName: {
            type: String,
            required: function(this: IChat) {
                return this.isGroupChat === true;
            }
        },
        groupAdmin: {
            type: String,
            required: function(this: IChat) {
                return this.isGroupChat === true;
            }
        },
        users: [{
            type: String,
            required: true,
        }],
        latestMessage: {
            text: String,
            sender: String
        },
    },
    {
        timestamps: true,
    }
);

export const Chat = mongoose.model<IChat>("Chat", schema);