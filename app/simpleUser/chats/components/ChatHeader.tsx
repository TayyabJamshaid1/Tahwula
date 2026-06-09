// app/chat/components/ChatHeader.tsx
"use client";

import { User } from "@/app/store/AuthSlice";
import React, { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

interface ChatHeaderProps {
  user: User | null;
  setSidebarOpen: (open: boolean) => void;
  isTyping: boolean;
  onlineUsers: string[];
  isGroupChat?: boolean;
  groupName?: string;
  groupMembers?: User[];
  chatId?: string | null;
  loggedInUser?: User | null;
  typingUserName?: string;
  setShowGroupInfo?: (show: boolean) => void;
}

const ChatHeader = ({
  user,
  isTyping,
  onlineUsers,
  isGroupChat = false,
  typingUserName = "",
  groupName,
  setShowGroupInfo,
  groupMembers = [],
  loggedInUser,
}: ChatHeaderProps) => {
  const [showMembers, setShowMembers] = useState(false);

  const getOnlineMembersCount = () => {
    if (!isGroupChat) return 0;
    return groupMembers.filter((member) => onlineUsers.includes(member._id))
      .length;
  };

  if (!user && !isGroupChat) {
    return null;
  }

  return (
<div
  className={`p-[8.5px] border-b border-gray-700 bg-gray-900 ${
    isGroupChat ? "cursor-pointer hover:bg-gray-800" : ""
  }`}
  onClick={() => {
    if (isGroupChat) {
      setShowGroupInfo?.(true);
    }
  }}
>
        <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
            {isGroupChat ? (
              <Users className="w-6 h-6 text-gray-300" />
            ) : (
              <span className="text-lg font-medium text-gray-300">
                {user?.name?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "U"}
              </span>
            )}
          </div>
          {!isGroupChat && onlineUsers.includes(user?._id || "") && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-bold text-white truncate">
              {isGroupChat
                ? groupName
                : user?.name || user?.email?.split("@")[0]}
            </h2>
            {isGroupChat && (
              <button
                className="flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-lg text-xs hover:bg-gray-600 transition-colors text-white"
              >
                <span>{groupMembers.length} members</span>
               
              </button>
            )}
          </div>

          {isGroupChat ? (
            isTyping ? (
              <div className="text-xs text-blue-500">
                {typingUserName} is typing...
              </div>
            ) : (
              <div className="text-xs text-gray-400">
                <span>{getOnlineMembersCount()} online</span>
              </div>
            )
          ) : isTyping ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-blue-500 text-xs">typing...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${onlineUsers.includes(user?._id || "") ? "bg-green-500" : "bg-gray-500"}`}
              ></div>
              <span
                className={`text-xs ${onlineUsers.includes(user?._id || "") ? "text-green-500" : "text-gray-500"}`}
              >
                {onlineUsers.includes(user?._id || "") ? "Online" : "Offline"}
              </span>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default ChatHeader;
