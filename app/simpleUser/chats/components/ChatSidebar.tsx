// components/ChatSidebar.tsx - Design Only
"use client";

import { User } from "@/app/store/AuthSlice";
import React, { useMemo } from "react";

interface ChatSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  showAllUsers: boolean;
  setShowAllUsers: (show: boolean | ((prev: boolean) => boolean)) => void;
  selectedGroupUsers: string[];
  setSelectedGroupUsers: (users: string[] | ((prev: string[]) => string[])) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  isGroupChat: boolean;
  setIsGroupChat: (open: boolean) => void;
  chats: any[] | null;
  selectedUser: string | null;
  setSelectedUser: (userId: string | null) => void;
  users: User[] | null;
  loggedInUser: User | null;
  onlineUsers: string[];
  createChat: (user: User) => void;
  createGroupChat: (groupName: string, selectedUsers: string[]) => void;
}

const ChatSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  showAllUsers,
  setShowAllUsers,
  selectedGroupUsers,
  setSelectedGroupUsers,
  groupName,
  setGroupName,
  isGroupChat,
  setIsGroupChat,
  chats,
  selectedUser,
  setSelectedUser,
  users,
  loggedInUser,
  onlineUsers,
  createChat,
  createGroupChat,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
   const filteredUsers=useMemo(()=>{
    if (!searchQuery) return users;
    const lowercase=searchQuery.toLowerCase();
    return users?.filter(u=>u.name?.toLowerCase().includes(lowercase) || u.email?.toLowerCase().includes(lowercase));
   },[users,searchQuery])
  const handleUserSelectForGroup = (userId: string) => {
    if (selectedGroupUsers.includes(userId)) {
      setSelectedGroupUsers(selectedGroupUsers.filter(id => id !== userId));
    } else {
      setSelectedGroupUsers([...selectedGroupUsers, userId]);
    }
  };

  const handleCreateGroup = () => {
    createGroupChat(groupName, selectedGroupUsers);
  };

  const handleCancelGroup = () => {
    setIsGroupChat(false);
    setGroupName("");
    setSelectedGroupUsers([]);
    setShowAllUsers(false);
  };

  const handleIndividualChat = (user: User) => {
    if (!isGroupChat) {
      createChat(user);
    }
  };

  return (
    <aside
      className={`fixed z-20 sm:static top-0 left-0 h-screen w-80 bg-gray-900 border-r border-gray-700 transform ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 transition-transform duration-300 flex flex-col`}
    >
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-gray-700">
        <div className="sm:hidden flex justify-end mb-0">
          <button
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white">
              {showAllUsers ? (isGroupChat ? "Create Group" : "New Chat") : "Messages"}
            </h2>
          </div>

          {!isGroupChat && (
            <button
              className={`p-2.5 rounded-lg transition-colors ${
                showAllUsers
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
              onClick={() => setShowAllUsers((prev) => !prev)}
            >
              {showAllUsers ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* USER LIST / CHAT LIST SECTION */}
      {showAllUsers ? (
        <div className="space-y-4 h-full flex flex-col">
          {isGroupChat && (
            <>
              <div className="relative px-4">
                <svg className="absolute left-7 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Group name..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              
              {selectedGroupUsers.length > 0 && (
                <div className="px-4">
                  <div className="bg-blue-600/20 text-blue-400 p-2 rounded-lg text-sm">
                    Selected: {selectedGroupUsers.length} member{selectedGroupUsers.length !== 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </>
          )}

          <div className="relative px-4">
            <svg className="absolute left-7 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={isGroupChat ? "Search users to add..." : "Search Users..."}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2 overflow-y-auto h-full pb-4 px-4">
            {filteredUsers
              ?.filter((u) => u._id !== loggedInUser?._id)
              .map((u) => (
                <button
                  key={u._id}
                  onClick={() => {
                    if (isGroupChat) {
                      handleUserSelectForGroup(u._id);
                    } else {
                      handleIndividualChat(u);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    isGroupChat && selectedGroupUsers.includes(u._id)
                      ? "border-blue-500 bg-blue-600/20"
                      : "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {onlineUsers.includes(u._id) && (
                        <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-white">{u.name}</span>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {onlineUsers.includes(u._id) ? "Online" : "Offline"}
                      </div>
                    </div>
                    {isGroupChat && selectedGroupUsers.includes(u._id) && (
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              ))}
          </div>

          {isGroupChat && (
            <div className="p-4 border-t border-gray-700 flex gap-2">
              <button
                onClick={handleCancelGroup}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Group
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto h-full pb-4 px-4">
          {chats && chats.length > 0 ? (
            chats.map((chat) => {
              const latestMessage = chat.chat.latestMessage;
              const isSentByMe = latestMessage?.sender === loggedInUser?._id;
              const unseenCount = chat.chat.unseenCount;
              const isSelected = chat.chat._id === selectedUser;
              
              return (
                <button
                  key={chat.chat._id}
                  onClick={() => {
                    setSelectedUser(chat.chat._id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    isSelected
                      ? "bg-blue-600 border border-blue-500"
                      : "border border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                        {chat.chat.isGroupChat ? (
                          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        ) : (
                          <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                        {!chat.chat.isGroupChat && onlineUsers.includes(chat.user._id) && (
                          <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-gray-800"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold truncate ${isSelected ? "text-white" : "text-gray-200"}`}>
                          {chat.chat.isGroupChat ? chat.chat.groupName : chat.user.email}
                        </span>
                        {unseenCount > 0 && (
                          <div className="bg-red-600 text-white text-xs font-bold rounded-full min-w-[22px] h-5.5 flex items-center justify-center px-2">
                            {unseenCount > 99 ? "+99" : unseenCount}
                          </div>
                        )}
                      </div>
                      {latestMessage && (
                        <div className="flex items-center gap-2">
                          {isSentByMe ? (
                            <svg className="text-blue-400" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          ) : (
                            <svg className="text-green-400" width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3L22 4" />
                            </svg>
                          )}
                          <span className="text-sm text-gray-400 truncate flex-1">
                            {latestMessage.text}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-4 bg-gray-800 rounded-full mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-400 font-medium">No conversation yet</p>
              <p className="text-sm text-gray-500 mt-1">Start a new chat to begin messaging</p>
            </div>
          )}
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <button
          onClick={() => {
            setIsGroupChat(true);
            setShowAllUsers(true);
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors text-green-500"
        >
          <div className="p-1.5 bg-green-600 rounded-lg">
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="font-medium">Create Group</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors">
          <div className="p-1.5 bg-gray-700 rounded-lg">
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="font-medium text-gray-300">Profile</span>
        </button>
      
      </div>
    </aside>
  );
};

export default ChatSidebar;