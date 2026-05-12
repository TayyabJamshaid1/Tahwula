// app/chat/page.tsx - Design Only with Component Structure
"use client";

import React, { useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import { fetchAllUsersThunk, User } from "@/app/store/AuthSlice";
import ChatSidebar from "./components/ChatSidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/app/store/hooks";
import { createNewChatThunk, fetchAllChatsThunk } from "@/app/store/ChatSlice";
import { queryClient } from "@/components/Providers";
import { toast } from "react-toastify";

// Type definitions (kept for structure)
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

const mockLoggedInUser: User = {
  _id: "currentUser",
  name: "Current User",
  email: "me@example.com",
};

const mockChats: Chat[] = [
  {
    chat: {
      _id: "chat1",
      isGroupChat: false,
      unseenCount: 3,
      latestMessage: { text: "Hey! How are you?", sender: "user1" },
      updatedAt: new Date().toString(),
    },
    user: { _id: "user1", name: "John Doe" },
  },
  {
    chat: {
      _id: "chat2",
      isGroupChat: false,
      unseenCount: 0,
      latestMessage: { text: "See you tomorrow!", sender: "currentUser" },
      updatedAt: new Date().toString(),
    },
    user: { _id: "user2", name: "Sarah Johnson" },
  },
  {
    chat: {
      _id: "chat3",
      isGroupChat: true,
      groupName: "Dev Team",
      unseenCount: 5,
      latestMessage: { text: "Meeting at 3 PM", sender: "user3" },
      updatedAt: new Date().toString(),
    },
    user: { _id: "user3", name: "Mike Wilson" },
  },
];

const mockMessages: Message[] = [
  {
    _id: "msg1",
    chatId: "chat2",
    sender: "user2",
    text: "Hey! How are you doing today?",
    messageType: "text",
    seen: true,
    seenAt: new Date().toString(),
    createdAt: new Date().toString(),
  },
  {
    _id: "msg2",
    chatId: "chat2",
    sender: "currentUser",
    text: "I'm doing great! Thanks for asking 😊",
    messageType: "text",
    seen: true,
    seenAt: new Date().toString(),
    createdAt: new Date().toString(),
  },
  {
    _id: "msg3",
    chatId: "chat2",
    sender: "user2",
    text: "Check out this photo!",
    messageType: "image",
    image: {
      url: "https://via.placeholder.com/200",
      publicId: "img1",
    },
    seen: false,
    createdAt: new Date().toString(),
  },
];
const mockUser: User = {
  _id: "user2",
  name: "Sarah Johnson",
  email: "sarah@example.com",
};

const ChatPageDesign = () => {
  const dispatch = useAppDispatch();
  const { data: users, isLoading } = useQuery({
    queryKey: ["allChatUsers"],
    queryFn: async () => {
      return await dispatch(fetchAllUsersThunk()).unwrap();
    },
  });
  const {
    mutate: createNewChat,
    isPending,
    variables,
    isError,
  } = useMutation({
    mutationFn: async (otherUserId: string) => {
      return await dispatch(createNewChatThunk(otherUserId)).unwrap();
    },
    onSuccess: async (data) => {
      setSelectedUser(data.chatId);
      setShowAllUser(false);
      toast.success(data.message);
      await queryClient.invalidateQueries({ queryKey: ["fetchAllChats"] });
    },
  });
  const { data: allChats, isLoading: isAllChatLoading } = useQuery({
    queryKey: ["fetchAllChats"],
    queryFn: async () => {
      return await dispatch(fetchAllChatsThunk()).unwrap();
    },
  });

  // All state declarations preserved from original
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>("chat123");
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>(mockMessages);
  const [user, setUser] = useState<User | null>(mockUser);
  const [currentChatDetails, setCurrentChatDetails] =
    useState<GroupDetails | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>(["user1", "user2"]);

  // Mock functions (empty implementations for structure)
  const createChat = (user: User) => {
    createNewChat(user._id);
  };
  const createGroupChat = (groupName: string, selectedUsers: string[]) => {};
  const handleMessageSend = async (e: any, imageFile?: File | null) => {};
  const handleTyping = (value: string) => {};
  if (isLoading || isAllChatLoading || isPending) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full animate-spin" />

          <p className="text-gray-300 text-sm">Loading chats...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ChatSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        showAllUsers={showAllUser}
        setShowAllUsers={setShowAllUser}
        selectedGroupUsers={selectedGroupUsers}
        setSelectedGroupUsers={setSelectedGroupUsers}
        groupName={groupName}
        setGroupName={setGroupName}
        isGroupChat={isGroupChat}
        setIsGroupChat={setIsGroupChat}
        chats={mockChats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        users={users?.users}
        loggedInUser={mockLoggedInUser}
        onlineUsers={onlineUsers}
        createChat={createChat}
        createGroupChat={createGroupChat}
      />

      <div className="flex-1 flex flex-col justify-between p-4 backdrop-blur-xl bg-white/5 border-1 border-white/10">
        <ChatHeader
          user={user}
          isTyping={isTyping}
          setSidebarOpen={setSidebarOpen}
          onlineUsers={onlineUsers}
          isGroupChat={currentChatDetails?.isGroupChat || false}
          groupName={currentChatDetails?.groupName}
          groupMembers={currentChatDetails?.users || []}
          chatId={selectedUser}
          loggedInUser={mockLoggedInUser}
        />

        <ChatMessages
          selectedUser={selectedUser}
          loggedInUser={mockLoggedInUser}
          messages={messages}
          isGroupChat={currentChatDetails?.isGroupChat || false}
          groupMembers={currentChatDetails?.users || []}
        />

        <MessageInput
          selectedUser={selectedUser}
          message={message}
          setMessage={setMessage}
          handleMessageSend={handleMessageSend}
          handleTyping={handleTyping}
        />
      </div>
    </div>
  );
};

export default ChatPageDesign;
