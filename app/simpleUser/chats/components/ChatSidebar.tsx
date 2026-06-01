// app/chat/components/ChatList.tsx
"use client";

import { User } from "@/app/store/AuthSlice";
import React, { useMemo, useState } from "react";
import { X, Plus, Users, ChevronLeft } from "lucide-react";

interface ChatListProps {
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  users: User[] | null;
  loggedInUser: User | null;
  onlineUsers: string[];
  createChat: (user: User) => void;
  onCloseMobile?: () => void;
}

const ChatSidebar = ({
  showAllUsers,
  setShowAllUsers,
  chats,
  selectedUser,
  setSelectedUser,
  users,
  loggedInUser,
  onlineUsers,
  createChat,
  onCloseMobile,
}: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowercase = searchQuery.toLowerCase();
    return users?.filter(u => 
      u.name?.toLowerCase().includes(lowercase) || 
      u.email?.toLowerCase().includes(lowercase)
    );
  }, [users, searchQuery]);



  const handleCreateGroup = () => {
    // Implement group creation
    onCloseMobile?.();
  };



  const handleIndividualChat = (user: User) => {
    createChat(user);
    onCloseMobile?.();
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedUser(chatId);
    onCloseMobile?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-300" />
            </button>
            <h2 className="text-lg font-bold text-white">
              {showAllUsers ? ( "New Chat") : "Messages"}
            </h2>
          </div>

            <button
              className={`p-2 rounded-lg transition-colors ${
                showAllUsers
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={() => setShowAllUsers((prev) => !prev)}
            >
              {showAllUsers ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </button>
          
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showAllUsers ? (
          <div className="space-y-4">
           

            <div className="px-4">
              <input
                type="text"
                placeholder={"Search users..."}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 px-4 pb-4">
              {filteredUsers
                ?.filter((u) => u._id !== loggedInUser?._id)
                .map((u) => (
                  <button
                    key={u._id}
                    onClick={() => {
                     
                        handleIndividualChat(u);
                      
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-300">
                            {u.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        {onlineUsers.includes(u._id) && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-sm">{u.name}</p>
                        <p className="text-xs text-gray-400">
                          {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                        </p>
                      </div>
                     
                    </div>
                  </button>
                ))}
            </div>

          
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {chats && chats.length > 0 ? (
              chats.map((chat) => {
                const latestMessage = chat.chat.latestMessage;
                const isSentByMe = latestMessage?.sender === loggedInUser?._id;
                const unseenCount = chat.chat.unseenCount;
                const isSelected = chat.chat._id === selectedUser;
                
                return (
                  <button
                    key={chat.chat._id}
                    onClick={() => handleSelectChat(chat.chat._id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      isSelected
                        ? "bg-blue-600 border border-blue-500"
                        : "border border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                          {chat.chat.isGroupChat ? (
                            <Users className="w-5 h-5 text-gray-300" />
                          ) : (
                            <span className="text-sm font-medium text-gray-300">
                              {chat.user?.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        {!chat.chat.isGroupChat && onlineUsers.includes(chat.user?._id) && (
                          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-semibold truncate text-sm ${isSelected ? "text-white" : "text-gray-200"}`}>
                            {chat.chat.isGroupChat ? chat.chat.groupName : chat.user?.name || chat.user?.email}
                          </p>
                          {unseenCount > 0 && (
                            <span className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                              {unseenCount > 99 ? "+99" : unseenCount}
                            </span>
                          )}
                        </div>
                        {latestMessage && (
                          <div className="flex items-center gap-1">
                            {isSentByMe && (
                              <svg className="text-blue-400" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                              </svg>
                            )}
                            <p className="text-xs text-gray-400 truncate flex-1">
                              {latestMessage.text}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No conversations yet</p>
                <p className="text-xs text-gray-500 mt-1">Click + to start a new chat</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;