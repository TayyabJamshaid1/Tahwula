import { User } from "@/app/store/AuthSlice";

export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

export interface GroupDetails {
  _id: string;
  isGroupChat: boolean;
  groupName?: string;
  groupAdmin?: string;
  users: User[];
  participants?: string[];
}

export interface Chat {
  chat: {
    _id: string;
    isGroupChat: boolean;
    groupName?: string;
    unseenCount: number;
    latestMessage?: {
      text: string;
      sender: string;
    };
    updatedAt: string;
  };
  user: User;
}
export interface Message {
  _id: string;
  chatId: string;
  sender: string;
  text?: string;
  image?: {
    url: string;
    publicId: string;
  };
  messageType: "text" | "image";
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

export interface GroupDetails {
  _id: string;
  isGroupChat: boolean;
  groupName?: string;
  groupAdmin?: string;
  users: User[];
  participants?: string[];
}

export interface Chat {
  chat: {
    _id: string;
    isGroupChat: boolean;
    groupName?: string;
    unseenCount: number;
    latestMessage?: {
      text: string;
      sender: string;
    };
    updatedAt: string;
  };
  user: User;
}

