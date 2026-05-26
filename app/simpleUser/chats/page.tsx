// app/chat/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import { User } from "@/app/store/AuthSlice";
import ChatSidebar from "./components/ChatSidebar";
import { useAppSelector } from "@/app/store/hooks";
import { queryClient } from "@/components/Providers";
import { SocketData } from "@/components/SocketContext";
import { useChatQuery } from "./hooks/useChatQuery";
import { useChatMutations } from "./hooks/useChatMutation";
import { Chat, GroupDetails, Message } from "./types/chat.types";

// Type definitions
const ChatPageDesign = () => {
  const userInfo: User | null = useAppSelector((state) => state?.auth?.user);
  const { onlineUsers, socket } = SocketData();

  // State declarations
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedGroupUsers, setSelectedGroupUsers] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  // Custom hooks
  const { users, allChats, isUsersLoading, isAllChatLoading } =
    useChatQuery(userInfo);

  const moveChatToTop = (
    chatId: string | null,
    newMessage: any,
    updatedUnseenCount = true,
  ) => {
    queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
      if (!prev) return prev;
      const updatedChats = [...prev];
      const chatIndex = updatedChats.findIndex(
        (chat) => chat.chat._id === chatId,
      );
      if (chatIndex !== -1) {
        const [moveChat] = updatedChats.splice(chatIndex, 1);
        const updatedChat = {
          ...moveChat,
          chat: {
            ...moveChat.chat,
            latestMessage: {
              text: newMessage.text,
              sender: newMessage.sender,
            },
            updatedAt: new Date().toString(),
            unseenCount:
              updatedUnseenCount && newMessage.sender !== userInfo?._id
                ? (moveChat.chat.unseenCount || 0) + 1
                : moveChat.chat.unseenCount || 0,
          },
        };
        updatedChats.unshift(updatedChat);
      }
      return updatedChats;
    });
  };

  const {
    createNewChat,
    fetchMessages,
    sendMessage,
    isCreatingChat,
    messagesLoading,
    isSendingMessage
  } = useChatMutations({
    setSelectedUser,
    setShowAllUser,
    setMessages,
    setMessage,
    imageFile,
    message,
    selectedUser,
    userInfo,
    moveChatToTop,
  });

  const resetUnseenCount = (chatId: string) => {
    queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
      if (!prev) return prev;
      return prev.map((chat: any) => {
        if (chat.chat._id === chatId) {
          return {
            ...chat,
            chat: {
              ...chat.chat,
              unseenCount: 0,
            },
          };
        }
        return chat;
      });
    });
  };

  const handleMessageSend = async (e: any, imageFile?: File | null) => {
    e.preventDefault();
    if (isSendingMessage) return; 
    if (!message.trim() && !imageFile) return;
    if (!selectedUser) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    socket?.emit("stopTyping", {
      userId: userInfo?._id,
      chatId: selectedUser,
    });

    const formData: FormData = new FormData();
    formData.append("chatId", selectedUser);
    formData.append("text", message);

    if (imageFile) {
      formData.append("image", imageFile);
      setImageFile(imageFile);
    }

    sendMessage(formData);
  };

  const handleTyping = (value: string) => {
    setMessage(value);
    if (!selectedUser || !socket) return;

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

  const createChat = (user: User) => {
    createNewChat(user._id);
  };

  const createGroupChat = (groupName: string, selectedUsers: string[]) => {
    // Implementation for group chat creation
  };

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;
    const handleNewChat = (newChat: any) => {
      queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
        const chatExists = prev.some(
          (chat: Chat) => chat.chat._id === newChat._id,
        );
        if (chatExists) return prev;
        return [...prev, newChat];
      });

      moveChatToTop(newChat._id, newChat.chat.latestMessage, false);
    };
    const handleNewMessage = (message: any) => {
      if (selectedUser == message.chatId) {
        setMessages((prev) => {
          if (!prev || prev.length == 0) return [];
          let currentMessageAlreadyAvailable = prev.some(
            (msg) => msg._id == message._id,
          );
          if (currentMessageAlreadyAvailable) {
            return prev;
          } else {
            return [...prev, message];
          }
        });
        moveChatToTop(message.chatId, message, false);
      } else {
        moveChatToTop(message.chatId, message, true);
      }
    };

    const MessagesSeen = (data: any) => {
      if (selectedUser === data?.chatId) {
        setMessages((prev) => {
          if (!prev) return null;
          return prev.map((msg) => {
            if (
              msg.sender == userInfo?._id &&
              data?.messageIds &&
              data.messageIds.includes(msg._id)
            ) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            } else if (msg.sender == userInfo?._id && !data?.messageIds) {
              return {
                ...msg,
                seen: true,
                seenAt: new Date().toString(),
              };
            } else {
              return msg;
            }
          });
        });
      }
    };

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
    socket.on("newChat", handleNewChat);
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", MessagesSeen);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStopTyping", handleUserStopTyping);

    return () => {
      socket.off("newChat", handleNewChat);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", MessagesSeen);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStopTyping", handleUserStopTyping);
    };
  }, [socket, selectedUser, userInfo?._id]);

  useEffect(() => {
    if (selectedUser) {
      setIsTyping(false);
      fetchMessages(selectedUser);
      resetUnseenCount(selectedUser);
      socket?.emit("joinChat", selectedUser);
      return () => {
        socket?.emit("leaveChat", selectedUser);
      };
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Set current chat details when user changes
  useEffect(() => {
    if (selectedUser && allChats) {
      const chat = allChats.find((chat: any) => chat.chat._id === selectedUser);
      if (chat) {
        setCurrentChatDetails({
          _id: chat.chat._id,
          isGroupChat: chat.chat.isGroupChat,
          groupName: chat.chat.groupName,
          groupAdmin: chat.chat.groupAdmin,
          users: chat.user ? [chat.user] : [],
        });
        setUser(chat.user);
      }
    }
  }, [selectedUser, allChats]);

  if (isUsersLoading || isAllChatLoading || isCreatingChat) {
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
          messagesLoading={messagesLoading}
        />

        <MessageInput
          selectedUser={selectedUser}
          message={message}
          setMessage={setMessage}
          handleMessageSend={handleMessageSend}
          handleTyping={handleTyping}
          isSendingMessage={isSendingMessage}
          messagesLoading={messagesLoading}
        />
      </div>
    </div>
  );
};

export default ChatPageDesign;
