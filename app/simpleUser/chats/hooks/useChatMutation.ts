// hooks/useChatMutations.ts
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/app/store/hooks";
import { createNewChatThunk, fetchChatMessagesThunk, sendMessageThunk } from "@/app/store/ChatSlice";
import { queryClient } from "@/components/Providers";
import { toast } from "react-toastify";
import { Dispatch, SetStateAction } from "react";
import { Message } from "../types/chat.types";

interface UseChatMutationsProps {
  setSelectedUser: Dispatch<SetStateAction<string | null>>;
  setShowAllUser: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[] | null>>;
  setMessage: Dispatch<SetStateAction<string>>;
  imageFile: File | null;
  message: string;
  selectedUser: string | null;
  userInfo: any;
  moveChatToTop: (chatId: string | null, newMessage: any, updatedUnseenCount?: boolean) => void;
}

export const useChatMutations = ({
  setSelectedUser,
  setShowAllUser,
  setMessages,
  setMessage,
  imageFile,
  message,
  selectedUser,
  userInfo,
  moveChatToTop,
}: UseChatMutationsProps) => {
  const dispatch = useAppDispatch();

  const { mutate: createNewChat, isPending: isCreatingChat } = useMutation({
    mutationFn: async (otherUserId: string) => {
      return await dispatch(createNewChatThunk(otherUserId)).unwrap();
    },
    onSuccess: async (data) => {
      setSelectedUser(data.chatId);
      setShowAllUser(false);
      toast.success(data.message);
      await queryClient.invalidateQueries({ queryKey: ["fetchAllChats"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create chat");
    },
  });

  const { mutate: fetchMessages, isPending: messagesLoading } = useMutation({
    mutationFn: async (selectedUser: string) => {
      return await dispatch(fetchChatMessagesThunk(selectedUser)).unwrap();
    },
    onSuccess: async (data) => {
      setMessages(data.messages);
    },
    onError: async (err) => {
      console.log(err);
      toast.error("Failed to fetch messages");
    },
  });

  const { mutate: sendMessage, isPending: isSendingMessage } = useMutation({
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
      const displayText = imageFile ? "Sent an image" : message;
      moveChatToTop(
        selectedUser,
        { text: displayText, sender: data.sender },
        false,
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to send message");
    },
  });

  const sendMessageHandler = (formData: FormData) => {
    sendMessage(formData);
  };

  const createChatHandler = (otherUserId: string) => {
    createNewChat(otherUserId);
  };

  const fetchMessagesHandler = (chatId: string) => {
    fetchMessages(chatId);
  };

  return {
    createNewChat: createChatHandler,
    fetchMessages: fetchMessagesHandler,
    sendMessage: sendMessageHandler,
    isCreatingChat,
    messagesLoading,
    isSendingMessage,
  };
};