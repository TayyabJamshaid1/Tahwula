// components/ChatHeader.tsx - Design Only
"use client";

import { User } from "@/app/simpleUser/chats/page";
import React, { useState } from "react";

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
}

const ChatHeader = ({
  user,
  setSidebarOpen,
  isTyping,
  onlineUsers,
  isGroupChat = false,
  groupName,
  groupMembers = [],
  chatId,
  loggedInUser,
}: ChatHeaderProps) => {
  const [showMembers, setShowMembers] = useState(false);
  
  const getOnlineMembersCount = () => {
    if (!isGroupChat) return 0;
    return groupMembers.filter(member => onlineUsers.includes(member._id)).length;
  };

  const getMemberNames = () => {
    if (!groupMembers) return "";
    const otherMembers = groupMembers.filter(m => m._id !== loggedInUser?._id);
    if (otherMembers.length === 0) return "No other members";
    return otherMembers.map(m => m.name).join(", ");
  };

  if (!user && !isGroupChat) {
    return (
      <>
        <div className="sm:hidden fixed top-4 right-4 z-30">
          <button
            className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-400">Select a conversation</h2>
              <p className="text-sm text-gray-500 mt-1">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="sm:hidden fixed top-4 right-4 z-30">
        <button
          className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <svg className="w-5 h-5 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
              {isGroupChat ? (
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            {!isGroupChat && onlineUsers.includes(user?._id || '') && (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800">
                <span className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></span>
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-white truncate">
                {isGroupChat ? groupName : user?.name}
              </h2>
              {isGroupChat && (
                <button
                  onClick={() => setShowMembers(!showMembers)}
                  className="px-2 py-1 bg-gray-700 rounded-lg text-xs hover:bg-gray-600 transition-colors"
                >
                  {groupMembers.length} members
                </button>
              )}
            </div>
            
            {isGroupChat ? (
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{getOnlineMembersCount()} online</span>
                  <span>•</span>
                  <span>{groupMembers.length} total members</span>
                </div>
                {showMembers && (
                  <div className="mt-3 p-3 bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold mb-2 text-gray-300">Group Members:</p>
                    <div className="space-y-1">
                      {groupMembers.map((member) => (
                        <div key={member._id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(member._id) ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                            <span className={member._id === loggedInUser?._id ? 'text-blue-400' : 'text-gray-300'}>
                              {member.name} {member._id === loggedInUser?._id && '(You)'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              isTyping ? (
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                  <span className="text-blue-500 font-medium">typing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${onlineUsers.includes(user?._id || '') ? "bg-green-500" : "bg-gray-500"}`}></div>
                  <span className={`text-sm font-medium ${onlineUsers.includes(user?._id || '') ? "text-green-500" : "text-gray-500"}`}>
                    {onlineUsers.includes(user?._id || '') ? "Online" : "Offline"}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHeader;