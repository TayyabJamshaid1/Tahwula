// app/chat/components/ChatMessages.tsx
"use client";

import React, { useEffect, useRef } from "react";
import moment from "moment";
import { User } from "@/app/store/AuthSlice";
import { Message } from "../types/chat.types";

interface ChatMessagesProps {
  selectedUser: string | null;
  messages: Message[] | null;
  loggedInUser: User | null;
  messagesLoading?: boolean;
  isGroupChat?: boolean;
  groupMembers?: User[];
}

const ChatMessages = ({
  selectedUser,
  messages,
  loggedInUser,
  isGroupChat = false,
  messagesLoading = false,
  groupMembers = [],
}: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedUser, messages]);

  const getSenderName = (senderId: string) => {
    if (!isGroupChat) return null;
    const sender = groupMembers.find(m => m._id === senderId);
    return sender?.name || "Unknown User";
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 overflow-hidden">
        <div className="w-full max-h-[calc(100vh-180px)] overflow-y-auto p-2 space-y-2">
          <p className="text-gray-400 text-center mt-10 sm:mt-20 text-sm sm:text-base">
            Please select a chat to start messaging
          </p>
        </div>
      </div>
    );
  }
  
  if (messagesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-xs">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4 space-y-3">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => {
          const isSentByMe = message.sender === loggedInUser?._id;
          const senderName = getSenderName(message.sender);
          const uniqueKey = `${message._id}-${index}`;
          
          return (
            <div
              key={uniqueKey}
              className={`flex flex-col gap-1 ${
                isSentByMe ? "items-end" : "items-start"
              }`}
            >
              {isGroupChat && !isSentByMe && senderName && (
                <span className="text-xs text-gray-400 ml-2">{senderName}</span>
              )}
              <div
                className={`rounded-lg p-3 max-w-[75%] sm:max-w-[60%] ${
                  isSentByMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-white"
                }`}
              >
                {message.messageType === "image" && message.image && (
                  <img
                    src={message.image.url}
                    alt="shared image"
                    className="max-w-full h-auto rounded-lg max-h-64 object-cover"
                  />
                )}
                {message.text && <p className="text-sm sm:text-base break-words">{message.text}</p>}
              </div>
              <div
                className={`flex items-center gap-1 text-xs text-gray-400 ${
                  isSentByMe ? "pr-2 flex-row-reverse" : "pl-2"
                }`}
              >
                <span>{moment(message.createdAt).format("hh:mm A")}</span>
                {isSentByMe && (
                  <div className="flex items-center ml-1">
                    {message.seen ? (
                      <div className="flex items-center gap-1 text-blue-400">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No messages yet</p>
          <p className="text-xs text-gray-500 mt-1">Send a message to start the conversation</p>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;