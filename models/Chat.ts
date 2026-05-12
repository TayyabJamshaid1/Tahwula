// models/Chat.ts
import mongoose, { Schema, Document,models,model } from "mongoose";

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


const Chat = models?.Chat || model<IChat>("Chat", schema);

export default Chat;