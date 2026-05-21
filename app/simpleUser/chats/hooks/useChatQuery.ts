// hooks/useChatQuery.ts
import { useQuery } from "@tanstack/react-query";
import { useAppDispatch } from "@/app/store/hooks";
import { fetchAllChatsThunk, fetchChatMessagesThunk } from "@/app/store/ChatSlice";
import { fetchAllUsersThunk, User } from "@/app/store/AuthSlice";

export const useChatQuery = (userInfo: User | null) => {
  const dispatch = useAppDispatch();

  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["allChatUsers"],
    queryFn: async () => {
      return await dispatch(fetchAllUsersThunk()).unwrap();
    },
    enabled: !!userInfo,
  });

  const { data: allChats, isLoading: isAllChatLoading } = useQuery({
    queryKey: ["fetchAllChats"],
    queryFn: async () => {
      return await dispatch(fetchAllChatsThunk()).unwrap();
    },
    enabled: !!userInfo,
  });

  const fetchMessages = async (selectedUser: string) => {
    return await dispatch(fetchChatMessagesThunk(selectedUser)).unwrap();
  };

  return {
    users,
    allChats,
    isUsersLoading,
    isAllChatLoading,
    fetchMessages,
  };
};