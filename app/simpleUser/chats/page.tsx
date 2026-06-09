// app/chat/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import MessageInput from "./components/MessageInput";
import { User } from "@/app/store/AuthSlice";
import { useAppSelector } from "@/app/store/hooks";
import { queryClient } from "@/components/Providers";
import { SocketData } from "@/components/SocketContext";
import { useChatQuery } from "./hooks/useChatQuery";
import { useChatMutations } from "./hooks/useChatMutation";
import { Chat, GroupDetails, Message } from "./types/chat.types";
import ChatSidebar from "./components/ChatSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import GroupInfoModal from "./components/ GroupInfoModal";

const ChatPageDesign = () => {
  const userInfo: User | null = useAppSelector((state) => state?.auth?.user);
  const { onlineUsers, socket } = SocketData();

  // State declarations
  const [typingUserName, setTypingUserName] = useState("");
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [showChatList, setShowChatList] = useState(false);
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
    createGroupChat,
    isCreatingGroup,
    renameGroup,
    addGroupMembers,
    leaveGroup,
    isRenamingGroup,
    isAddingMembers,
    isLeavingGroup,
    isSendingMessage,
    removeGroupMember,
    isRemovingMember,
    transferAdmin,
    isTransferringAdmin,
    updateGroupImage,
    isUpdatingGroupImage,
    deleteGroup,
    isDeletingGroup,
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
      userName: userInfo?.name || userInfo?.email?.split("@")[0],
      chatId: selectedUser,
    });

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

    if (value.trim()) {
      socket.emit("typing", {
        userId: userInfo?._id,
        userName: userInfo?.name || userInfo?.email?.split("@")[0],
        chatId: selectedUser,
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        userId: userInfo?._id,
        userName: userInfo?.name || userInfo?.email?.split("@")[0],
        chatId: selectedUser,
      });
    }, 2000);
  };

  const createChat = (user: User) => {
    createNewChat(user._id);
    setShowChatList(false);
  };

  // Socket event handlers
  useEffect(() => {
    if (!socket) return;
    const handleNewChat = (newChat: any) => {
      console.log("Received new chat via socket:", newChat);

      queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
        if (!prev) return [newChat];

        const chatExists = prev.some(
          (chat: Chat) => chat.chat._id === newChat.chat._id,
        );

        if (chatExists) return prev;

        return [newChat, ...prev];
      });

      if (newChat.chatType === "group") {
        toast.info(
          `You were added to ${newChat.groupInfo?.groupName || "a group"}`,
        );
      } else {
        toast.info(
          `You have a new chat with ${
            newChat.user?.name || newChat.user?.email?.split("@")[0]
          }`,
        );
      }
    };
    const handleNewMessage = (message: any) => {
      console.log(message);
      
      if (selectedUser == message.chatId) {
        setMessages((prev) => {
          if (!prev || prev.length == 0) return [message];
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
      if (selectedUser !== data?.chatId) return;

      if (!Array.isArray(data.messageIds)) return;

      setMessages((prev) => {
        if (!prev) return null;

        return prev.map((msg) => {
          if (!data.messageIds.includes(msg._id)) return msg;

          const usersToAdd = Array.isArray(data.seenByUsers)
            ? data.seenByUsers
            : data.seenBy
              ? [
                  {
                    userId: data.seenBy,
                    seenAt: data.seenAt || new Date().toString(),
                  },
                ]
              : [];

          if (usersToAdd.length === 0) return msg;

          const newSeenBy = [...(msg.seenBy || [])];

          usersToAdd.forEach((seenUser: any) => {
            if (!seenUser?.userId) return;

            const alreadySeen = newSeenBy.some(
              (s) => s.userId === seenUser.userId,
            );

            if (!alreadySeen) {
              newSeenBy.push({
                userId: seenUser.userId,
                seenAt: seenUser.seenAt || new Date().toString(),
              });
            }
          });

          return {
            ...msg,
            seenBy: newSeenBy,
          };
        });
      });
    };

    const handleUserTyping = (data: any) => {
      if (data.chatId === selectedUser && data.userId !== userInfo?._id) {
        setIsTyping(true);
        setTypingUserName(data.userName || "Someone");
      }
    };

    const handleUserStopTyping = (data: any) => {
      if (data.chatId === selectedUser && data.userId !== userInfo?._id) {
        setIsTyping(false);
        setTypingUserName("");
      }
    };
    const handleGroupUpdated = (data: any) => {
      console.log("groupUpdated:", data);

      queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
        if (!prev) return prev;

        return prev.map((chat: any) => {
          if (chat.chat._id !== data.chatId) return chat;

          return {
            ...data.group,
            chat: {
              ...data.group.chat,
              latestMessage: {
                text: data.message,
                sender: data.updatedBy,
              },
              updatedAt: new Date().toString(),
            },
          };
        });
      });

      if (selectedUser === data.chatId) {
        setCurrentChatDetails({
          _id: data.group.chat._id,
          isGroupChat: true,
          groupName: data.group.groupInfo?.groupName,
          groupImage: data.group.groupInfo?.groupImage,
          groupAdmin: data.group.groupInfo?.admin,
          users: data.group.groupInfo?.members || [],
        });
      }

      toast.info(data.message || "Group updated");
    };
    const handleRemovedFromGroup = (data: any) => {
      toast.error(data.message || "You were removed from the group");

      queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
        if (!prev) return prev;

        return prev.filter((chat: any) => chat.chat._id !== data.chatId);
      });

      if (selectedUser === data.chatId) {
        setSelectedUser(null);
        setCurrentChatDetails(null);
        setMessages([]);
        setUser(null);
      }
    };
    const handleGroupDeleted = (data: any) => {
      toast.error(data.message || "Group deleted");

      queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
        if (!prev) return prev;

        return prev.filter((chat: any) => chat.chat._id !== data.chatId);
      });

      if (selectedUser === data.chatId) {
        setSelectedUser(null);
        setCurrentChatDetails(null);
        setMessages([]);
        setUser(null);
      }
    };
    socket.on("groupUpdated", handleGroupUpdated);
    socket.on("removedFromGroup", handleRemovedFromGroup);
    socket.on("groupDeleted", handleGroupDeleted);
    socket.on("newChat", handleNewChat);
    socket.on("newMessage", handleNewMessage);
    socket.on("messagesSeen", MessagesSeen);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStopTyping", handleUserStopTyping);

    return () => {
      socket.off("removedFromGroup", handleRemovedFromGroup);
      socket.off("groupDeleted", handleGroupDeleted);
      socket.off("newChat", handleNewChat);
      socket.off("newMessage", handleNewMessage);
      socket.off("messagesSeen", MessagesSeen);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStopTyping", handleUserStopTyping);
      socket.off("groupUpdated", handleGroupUpdated);
    };
  }, [socket, selectedUser, userInfo?._id]);

  useEffect(() => {
    if (selectedUser) {
      setIsTyping(false);
      fetchMessages(selectedUser);
      setTypingUserName("");
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
          isGroupChat: chat.chatType === "group",
          groupName: chat.groupInfo?.groupName,
          groupImage: chat.groupInfo?.groupImage,
          groupAdmin: chat.groupInfo?.admin,
          users: chat.groupInfo?.members || [],
        });

        setUser(chat.chatType === "single" ? chat.user : null);
      }
    }
  }, [selectedUser, allChats]);

  if (isUsersLoading || isAllChatLoading || isCreatingChat) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      {/* Chat List Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-gray-900 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          showChatList ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ height: "calc(100vh - 4rem)" }}
      >
        <ChatSidebar
          showAllUsers={showAllUser}
          setShowAllUsers={setShowAllUser}
          chats={allChats}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users?.users}
          loggedInUser={userInfo}
          onlineUsers={onlineUsers}
          createChat={createChat}
          createGroupChat={createGroupChat}
          isCreatingGroup={isCreatingGroup}
          onCloseMobile={() => setShowChatList(false)}
        />
      </div>

      {/* Mobile overlay */}
      {showChatList && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          style={{ top: "4rem" }}
          onClick={() => setShowChatList(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header with menu button */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-gray-700 bg-gray-900 sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowChatList(true)}
            className="text-white hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {selectedUser && (
            <div className="flex-1">
              <h3 className="font-semibold text-white">
                {currentChatDetails?.isGroupChat
                  ? currentChatDetails.groupName
                  : user?.name || user?.email?.split("@")[0]}
              </h3>
              {currentChatDetails?.isGroupChat ? (
                <p className="text-xs text-gray-400">
                  {currentChatDetails.users?.length || 0} members
                </p>
              ) : (
                <p className="text-xs text-gray-400">
                  {onlineUsers.includes(user?._id || "") ? "Online" : "Offline"}
                </p>
              )}
            </div>
          )}
        </div>

        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-400">Select a conversation</p>
              <p className="text-sm text-gray-500 mt-1">
                Choose a chat from the list to start messaging
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Header - Hidden on mobile */}
            <div className="hidden lg:block flex-shrink-0">
              <ChatHeader
                user={user}
                isTyping={isTyping}
                typingUserName={typingUserName}
                setSidebarOpen={() => {}}
                onlineUsers={onlineUsers}
                chatId={selectedUser}
                loggedInUser={userInfo}
                isGroupChat={currentChatDetails?.isGroupChat}
                groupName={currentChatDetails?.groupName}
                groupMembers={currentChatDetails?.users || []}
                setShowGroupInfo={setShowGroupInfo}
              />
            </div>

            {/* Messages Area - Takes remaining space */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ChatMessages
                selectedUser={selectedUser}
                loggedInUser={userInfo}
                messages={messages}
                messagesLoading={messagesLoading}
                isGroupChat={currentChatDetails?.isGroupChat}
                groupMembers={currentChatDetails?.users || []}
              />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="flex-shrink-0">
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
          </>
        )}
        {showGroupInfo && currentChatDetails?.isGroupChat && (
          <GroupInfoModal
            currentChatDetails={currentChatDetails}
            loggedInUser={userInfo}
            users={users?.users || []}
            renameGroup={renameGroup}
            addGroupMembers={addGroupMembers}
            leaveGroup={leaveGroup}
            isRenamingGroup={isRenamingGroup}
            isAddingMembers={isAddingMembers}
            isLeavingGroup={isLeavingGroup}
            onClose={() => setShowGroupInfo(false)}
            removeGroupMember={removeGroupMember}
            isRemovingMember={isRemovingMember}
            transferAdmin={transferAdmin}
            isTransferringAdmin={isTransferringAdmin}
            updateGroupImage={updateGroupImage}
            isUpdatingGroupImage={isUpdatingGroupImage}
            deleteGroup={deleteGroup}
            isDeletingGroup={isDeletingGroup}
          />
        )}
      </div>
    </div>
  );
};

export default ChatPageDesign;
