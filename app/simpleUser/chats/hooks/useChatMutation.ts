// hooks/useChatMutations.ts
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/app/store/hooks";
import {
  addMembersToGroupThunk,
  createGroupChatThunk,
  createNewChatThunk,
  fetchChatMessagesThunk,
  leaveGroupChatThunk,
  removeMemberFromGroupThunk,
  renameGroupChatThunk,
  sendMessageThunk,
  transferGroupAdminThunk,
} from "@/app/store/ChatSlice";
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
  moveChatToTop: (
    chatId: string | null,
    newMessage: any,
    updatedUnseenCount?: boolean,
  ) => void;
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
  const { mutate: createGroupChatMutation, isPending: isCreatingGroup } =
    useMutation({
      mutationFn: async (payload: {
        groupName: string;
        members: string[];
        onSuccess?: () => void;
      }) => {
        return await dispatch(
          createGroupChatThunk({
            groupName: payload.groupName,
            members: payload.members,
          }),
        ).unwrap();
      },

      onSuccess: async (data, variables) => {
        toast.success(data.message || "Group created");

        queryClient.setQueryData(["fetchAllChats"], (prev: any) => {
          if (!prev) return [data.group];

          const exists = prev.some(
            (chat: any) => chat.chat._id === data.group.chat._id,
          );

          if (exists) return prev;

          return [data.group, ...prev];
        });

        setSelectedUser(data.group.chat._id);
        setShowAllUser(false);

        variables.onSuccess?.();
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
  const { mutate: renameGroup, isPending: isRenamingGroup } = useMutation({
    mutationFn: async (payload: {
      chatId: string;
      groupName: string;
      onSuccess?: () => void;
    }) => {
      return await dispatch(
        renameGroupChatThunk({
          chatId: payload.chatId,
          groupName: payload.groupName,
        }),
      ).unwrap();
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "Group renamed");
      variables.onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to rename group");
    },
  });

  const { mutate: addGroupMembers, isPending: isAddingMembers } = useMutation({
    mutationFn: async (payload: {
      chatId: string;
      members: string[];
      onSuccess?: () => void;
    }) => {
      return await dispatch(
        addMembersToGroupThunk({
          chatId: payload.chatId,
          members: payload.members,
        }),
      ).unwrap();
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "Members added");
      variables.onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to add members");
    },
  });
  const { mutate: transferAdmin, isPending: isTransferringAdmin } = useMutation(
    {
      mutationFn: async (payload: {
        chatId: string;
        newAdminId: string;
        onSuccess?: () => void;
      }) => {
        return await dispatch(
          transferGroupAdminThunk({
            chatId: payload.chatId,
            newAdminId: payload.newAdminId,
          }),
        ).unwrap();
      },

      onSuccess: (data, variables) => {
        toast.success(data.message || "Admin transferred");
        variables.onSuccess?.();
      },

      onError: (error: any) => {
        toast.error(error.message || "Failed to transfer admin");
      },
    },
  );
  const { mutate: leaveGroup, isPending: isLeavingGroup } = useMutation({
    mutationFn: async (payload: { chatId: string; onSuccess?: () => void }) => {
      return await dispatch(leaveGroupChatThunk(payload.chatId)).unwrap();
    },

    onSuccess: (data, variables) => {
      toast.success(data.message || "Left group");
      variables.onSuccess?.();
    },

    onError: (error: any) => {
      toast.error(error.message || "Failed to leave group");
    },
  });
  const { mutate: removeGroupMember, isPending: isRemovingMember } =
    useMutation({
      mutationFn: async (payload: {
        chatId: string;
        memberId: string;
        onSuccess?: () => void;
      }) => {
        return await dispatch(
          removeMemberFromGroupThunk({
            chatId: payload.chatId,
            memberId: payload.memberId,
          }),
        ).unwrap();
      },

      onSuccess: (data, variables) => {
        toast.success(data.message || "Member removed");

        variables.onSuccess?.();
      },

      onError: (error: any) => {
        toast.error(error.message || "Failed to remove member");
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
    createGroupChat: createGroupChatMutation,
    renameGroup,
    addGroupMembers,
    leaveGroup,
    isCreatingGroup,
    isRenamingGroup,
    isAddingMembers,
    isLeavingGroup,
    isCreatingChat,
    transferAdmin,
    isTransferringAdmin,
    messagesLoading,
    isSendingMessage,
    removeGroupMember,
    isRemovingMember,
  };
};
