import  Chat  from "@/models/Chat";
import Message from "@/models/Messages";
import User from "@/models/User";
import { log } from "console";

export const createNewChatService = async (
  userId: string,
  otherUserId: string
) => {
  const existingChat = await Chat.findOne({
    users: {
      $all: [userId, otherUserId],
      $size: 2,
    },
  });

  if (existingChat) {
    return {
      alreadyExists: true,
      chatId: existingChat._id,
    };
  }

  const newChat = await Chat.create({
    users: [userId, otherUserId],
  });

  return {
    alreadyExists: false,
    chatId: newChat._id,
  };
};

export const fetchAllChatsService = async (
  userId: string
) => {
  console.log("Fetching all chats for user:", userId);
  const allChats = await Chat.find({
    users: {
      $in: [userId],
    },
  }).sort({ updatedAt: -1 });

  const chatWithOtherUsers = await Promise.all(
    allChats.map(async (individualChat) => {
      const otherUserId = individualChat.users.find(
        (id: string) => id.toString() !== userId
      );

      const unseenCount =
        await Message.countDocuments({
          chatId: individualChat._id,
          sender: { $ne: userId },
          seen: false,
        });

      const otherUser =
        await User.findById(otherUserId).select(
          "-password"
        );

      return {
        user: otherUser,
        chat: {
          ...individualChat.toObject(),
          latestMessage:
            individualChat.latestMessage,
          unseenCount,
        },
      };
    })
  );

  return chatWithOtherUsers;
};