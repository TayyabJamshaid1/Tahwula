import Chat from "@/models/Chat";
import Message from "@/models/Messages";
import User from "@/models/User";
import axios from "axios";

export const createNewChatService = async (
  userId: string,
  otherUserId: string,
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

export const fetchAllChatsService = async (userId: string) => {
  const allChats = await Chat.find({
    users: {
      $in: [userId],
    },
  }).sort({ updatedAt: -1 });

  const chatWithOtherUsers = await Promise.all(
    allChats.map(async (individualChat) => {
      const currentUserId = userId.toString();

      const otherUserId = individualChat.users.find(
        (id: string) => id.toString() !== currentUserId,
      );

      const unseenCount = await Message.countDocuments({
        chatId: individualChat._id,
        sender: { $ne: userId },
        seen: false,
      });

      const otherUser = await User.findById(otherUserId).select("-password");

      return {
        user: otherUser,
        chat: {
          ...individualChat.toObject(),
          latestMessage: individualChat.latestMessage,
          unseenCount,
        },
      };
    }),
  );

  return chatWithOtherUsers;
};

export const getMessagesByChatService = async (
  chatId: string,
  userId: string,
) => {
  // FIND CHAT
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // CHECK USER IS PARTICIPANT
  const isUserInChat = chat.users.some(
    (currentUserId: string) =>
      currentUserId.toString() === userId.toString(),
  );

  if (!isUserInChat) {
    throw new Error("You are not a participant of this chat");
  }

  // FIND UNSEEN MESSAGES
  const messagesToMarkSeen = await Message.find({
    chatId,
    sender: { $ne: userId },
    seen: false,
  });

  // MARK MESSAGES AS SEEN
  await Message.updateMany(
    {
      chatId,
      sender: { $ne: userId },
      seen: false,
    },
    {
      seen: true,
      seenAt: new Date(),
    },
  );

  // FETCH ALL MESSAGES
  const messages = await Message.find({
    chatId,
  }).sort({
    createdAt: 1,
  });

  // FIND OTHER USER
  const otherUserId = chat.users.find(
    (id: string) => id.toString() !== userId.toString(),
  );

  if (!otherUserId) {
    throw new Error("Other user not found");
  }

  // FETCH OTHER USER
  const otherUser = await User.findById(otherUserId).select("-password");

  // EMIT SOCKET EVENT TO RECEIVER
  // ONLY IF THERE ARE NEWLY SEEN MESSAGES
  if (messagesToMarkSeen.length > 0) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/socket/emit`,
        {
          receiverId: otherUserId.toString(),
          event: "messageSeen",
          payload: {
            chatId,
            messageIds: messagesToMarkSeen.map((msg) => msg._id),
            seenBy: userId,
          },
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );
    } catch (socketError) {
      console.log(
        "Socket emit failed:",
        socketError,
      );
    }
  }

  return {
    messages,
    user: otherUser,
  };
};