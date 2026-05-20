// app/chat/page.tsx - Design Only with Component Structure
"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import { fetchAllUsersThunk, User } from "@/app/store/AuthSlice";
import ChatSidebar from "./components/ChatSidebar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  createNewChatThunk,
  fetchAllChatsThunk,
  fetchChatMessagesThunk,
  sendMessageThunk,
} from "@/app/store/ChatSlice";
import { queryClient } from "@/components/Providers";
import { toast } from "react-toastify";
import { SocketData } from "@/components/SocketContext";

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

const ChatPageDesign = () => {
  const dispatch = useAppDispatch();
  const userInfo: User | null = useAppSelector((state) => state?.auth?.user);
  const { onlineUsers, socket } = SocketData();
  const { data: users, isLoading } = useQuery({
    queryKey: ["allChatUsers"],
    queryFn: async () => {
      return await dispatch(fetchAllUsersThunk()).unwrap();
    },
    enabled: !!userInfo, // IMPORTANT
  });
  const { mutate: createNewChat, isPending } = useMutation({
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
  const { mutate: fetchMessages, isPending: messagesLoading } = useMutation({
    mutationFn: async (selectedUser: string) => {
      return await dispatch(fetchChatMessagesThunk(selectedUser)).unwrap();
    },
    onSuccess: async (data) => {
      setMessages(data.messages);
      setUser(data.selectedChatUser);
    },
    onError: async (err) => {
      console.log(err);
      toast.error("Failed to fetch messages");
    },
  });
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (formData: FormData) => {
      return await dispatch(sendMessageThunk(formData)).unwrap();
    },
    onSuccess: async (data) => {
      toast.success(data.message);
      setMessages((prev) => {
        let currentMessages = prev ? [...prev] : [];
        let existMessage = currentMessages.some(
          (m) => m._id === data.message._id,
        );
        if (!existMessage) {
          return [...currentMessages, data.message];
        }
        return currentMessages;
      });
      setMessage("");
    },
  });
  const { data: allChats, isLoading: isAllChatLoading } = useQuery({
    queryKey: ["fetchAllChats"],
    queryFn: async () => {
      return await dispatch(fetchAllChatsThunk()).unwrap();
    },
    enabled: !!userInfo, // IMPORTANT
  });

  // All state declarations preserved from original
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[] | null>([]);
  const [user, setUser] = useState<User | null>(null);
  const [currentChatDetails, setCurrentChatDetails] =
    useState<GroupDetails | null>(null);
  const [showAllUser, setShowAllUser] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Mock functions (empty implementations for structure)
  const createChat = (user: User) => {
    createNewChat(user._id);
  };
  const createGroupChat = (groupName: string, selectedUsers: string[]) => {};
  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();

    if (!message.trim() && !imageFile) return;

    if (!selectedUser) return;

    const formData: FormData = new FormData();

    formData.append("chatId", selectedUser);
    formData.append("text", message);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    sendMessage(formData);
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    if (!selectedUser || !socket) return;
    //sockets setup
    if (value.trim()) {
      socket.emit("typing", {
        userId: userInfo?._id,
        chatId: selectedUser,
      });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        userId: userInfo?._id,
        chatId: selectedUser,
      });
    }, 2000);
  };
  useEffect(() => {
    if (selectedUser) {
      setIsTyping(false);
      fetchMessages(selectedUser);
      socket?.emit("joinChat", selectedUser);
      return () => {
        socket?.emit("leaveChat", selectedUser);
      };
    }
  }, [selectedUser, socket]);
  useEffect(() => {
    if (!socket) return;

    const handleUserTyping = (data: any) => {
      if (data.chatId === selectedUser && data.userId !== userInfo?._id) {
        setIsTyping(true);
      }
    };

    const handleUserStopTyping = (data: any) => {
      if (data.chatId === selectedUser && data.userId !== userInfo?._id) {
        setIsTyping(false);
      }
    };

    socket.on("userTyping", handleUserTyping);
    socket.on("userStopTyping", handleUserStopTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStopTyping", handleUserStopTyping);
    };
  }, [socket, selectedUser, userInfo?._id]);
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
        chats={allChats}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        users={users?.users}
        loggedInUser={userInfo}
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
          loggedInUser={userInfo}
        />

        <ChatMessages
          selectedUser={selectedUser}
          loggedInUser={userInfo}
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
