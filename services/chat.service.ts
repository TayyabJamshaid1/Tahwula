import cloudinary from "@/lib/cloudinary";
import {
  formatGroupChatResponse,
  formatSingleChatResponse,
} from "@/lib/formatChatResponse";
import Chat from "@/models/Chat";
import Message from "@/models/Messages";
import User from "@/models/User";
import axios from "axios";
import mongoose from "mongoose";
interface SendMessageParams {
  senderId: string;
  chatId: string;
  text?: string;
  image?: File | null;
}
export const createNewChatService = async (
  userId: string,
  otherUserId: string,
) => {
  // =========================================
  // CHECK EXISTING CHAT
  // =========================================

  const existingChat = await Chat.findOne({
    users: {
      $all: [userId, otherUserId],
      $size: 2,
    },
  });

  // =========================================
  // EXISTING CHAT
  // =========================================

  if (existingChat) {
    return {
      alreadyExists: true,
      chatId: existingChat._id,
    };
  }

  // =========================================
  // CREATE NEW CHAT
  // =========================================

  const newChat = await Chat.create({
    users: [userId, otherUserId],
  });

  // =========================================
  // UNSEEN COUNT
  // =========================================

  const unseenCount = await Message.countDocuments({
    chatId: newChat._id,
    sender: { $ne: userId },
    seen: false,
  });

  // =========================================
  // GET OTHER USER DATA
  // =========================================

  let userData: any = await User.findById(otherUserId).select("-password");

  // =========================================
  // CHAT OBJECT
  // =========================================

  const chatObj = {
    user: userData,

    chat: {
      ...newChat.toObject(),

      latestMessage: {
        text: "Start a new chat",
        sender: userId,
      },

      unseenCount,
    },
  };

  // =========================================
  // EMIT SOCKET EVENT
  // =========================================

  try {
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
      {
        receiverId: otherUserId,
        event: "newChat",
        payload: chatObj,
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );
  } catch (error) {
    console.log("Socket emit failed:", error);
  }

  // =========================================
  // RETURN
  // =========================================

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

  const formattedChats = await Promise.all(
    allChats.map(async (individualChat) => {
      const unseenCount = await Message.countDocuments({
        chatId: individualChat._id,
        sender: { $ne: userId },
        "seenBy.userId": {
          $ne: userId.toString(),
        },
      });

      // =========================
      // GROUP CHAT
      // =========================
      if (individualChat.isGroupChat) {
        const membersData = await User.find({
          _id: {
            $in: individualChat.users,
          },
        }).select("-password");

        return formatGroupChatResponse({
          group: individualChat,
          unseenCount,
          members: membersData,
        });
      }

      // =========================
      // ONE TO ONE CHAT
      // =========================
      const otherUserId = individualChat.users.find(
        (id: string) => id.toString() !== userId.toString(),
      );

      const otherUser = await User.findById(otherUserId).select("-password");

      return formatSingleChatResponse({
        chat: individualChat,
        user: otherUser,
        unseenCount,
      });
    }),
  );

  return formattedChats;
};

export const getMessagesByChatService = async (
  chatId: string,
  userId: string,
  page = 1,
  limit = 30,
) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isUserInChat = chat.users.some(
    (currentUserId: string) => currentUserId.toString() === userId.toString(),
  );

  if (!isUserInChat) {
    throw new Error("You are not a participant of this chat");
  }

  // =========================
  // FIND UNSEEN MESSAGES
  // =========================

  const messagesToMarkSeen = await Message.find({
    chatId,
    sender: { $ne: userId },
    "seenBy.userId": {
      $ne: userId.toString(),
    },
  });

  // =========================
  // MARK AS SEEN
  // =========================

  await Message.updateMany(
    {
      chatId,
      sender: { $ne: userId },
      "seenBy.userId": {
        $ne: userId.toString(),
      },
    },
    {
      $push: {
        seenBy: {
          userId: userId.toString(),
          seenAt: new Date(),
        },
      },
    },
  );

  // =========================
  // PAGINATION
  // =========================

  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 30;
  const skip = (safePage - 1) * safeLimit;

  const totalMessages = await Message.countDocuments({
    chatId,
  });

  const messages = await Message.find({
    chatId,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(safeLimit);

  const formattedMessages = messages.reverse();

  // =========================
  // SOCKET SEEN EVENT
  // =========================

  if (messagesToMarkSeen.length > 0) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
        {
          roomId: chatId,
          event: "messagesSeen",
          payload: {
            chatId,
            messageIds: messagesToMarkSeen.map((msg) => msg._id),
            seenByUsers: [
              {
                userId,
                seenAt: new Date(),
              },
            ],
          },
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );
    } catch (socketError) {
      console.log("Socket messagesSeen emit failed:", socketError);
    }
  }

  // =========================
  // GROUP CHAT RESPONSE
  // =========================

  if (chat.isGroupChat) {
    const membersData = await User.find({
      _id: {
        $in: chat.users,
      },
    }).select("-password");

    return {
      messages: formattedMessages,
      chatType: "group",
      groupInfo: {
        _id: chat._id,
        groupName: chat.groupName,
        groupImage: chat.groupImage,
        admin: chat.admin,
        users: chat.users,
        members: membersData,
      },
      pagination: {
        page: safePage,
        limit: safeLimit,
        totalMessages,
        totalPages: Math.ceil(totalMessages / safeLimit),
        hasMore: safePage * safeLimit < totalMessages,
      },
    };
  }

  // =========================
  // SINGLE CHAT RESPONSE
  // =========================

  const otherUserId = chat.users.find(
    (id: string) => id.toString() !== userId.toString(),
  );

  if (!otherUserId) {
    throw new Error("Other user not found");
  }

  const otherUser = await User.findById(otherUserId).select("-password");

  return {
    messages: formattedMessages,
    chatType: "single",
    user: otherUser,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalMessages,
      totalPages: Math.ceil(totalMessages / safeLimit),
      hasMore: safePage * safeLimit < totalMessages,
    },
  };
};
export const sendMessageService = async ({
  senderId,
  chatId,
  text,
  image,
}: SendMessageParams) => {
  if (!chatId) {
    throw new Error("ChatId required");
  }

  if (!text && !image) {
    throw new Error("Text or image required");
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chat id");
  }

  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  const isUserInChat = chat.users.some(
    (userId: string) => userId.toString() === senderId.toString(),
  );

  if (!isUserInChat) {
    throw new Error("You are not participant of this chat");
  }

  // =========================
  // RECEIVERS
  // one-to-one => one receiver
  // group => multiple receivers
  // =========================

  const receivers = chat.users.filter(
    (userId: string) => userId.toString() !== senderId.toString(),
  );

  // =========================
  // CHECK WHO IS ACTIVELY VIEWING CHAT
  // =========================

  const seenByUsers: {
    userId: string;
    seenAt: Date;
  }[] = [];

  for (const receiverId of receivers) {
    try {
      const roomCheckResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/check-room`,
        {
          receiverId: receiverId.toString(),
          chatId,
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );

      if (roomCheckResponse.data?.isInRoom) {
        seenByUsers.push({
          userId: receiverId.toString(),
          seenAt: new Date(),
        });
      }
    } catch (error) {
      console.log("Room check failed:", error);
    }
  }

  // =========================
  // IMAGE UPLOAD
  // =========================

  let imageData;

  if (image) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "chat-images",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    imageData = {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  }

  // =========================
  // MESSAGE DATA
  // =========================

  const messageData: any = {
    chatId,
    sender: senderId,
    text: text || "",
    image: imageData,
    messageType: image ? "image" : "text",
    seenBy: seenByUsers,
  };

  const newMessage = await Message.create(messageData);

  // =========================
  // UPDATE CHAT LATEST MESSAGE
  // =========================

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: {
      text: image ? "Image" : text,
      sender: senderId,
    },
    updatedAt: new Date(),
  });

  // =========================
  // SOCKET EMITS
  // =========================

  try {
    // Send to users who have chat currently opened
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-room`,
      {
        roomId: chatId,
        event: "newMessage",
        payload: newMessage,
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );

    // Send direct event to receivers for sidebar update
    for (const receiverId of receivers) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
        {
          receiverId: receiverId.toString(),
          event: "newMessage",
          payload: newMessage,
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );
    }

    // Send to sender also for multiple tabs/devices sync
    await axios.post(
      `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
      {
        receiverId: senderId,
        event: "newMessage",
        payload: newMessage,
      },
      {
        headers: {
          "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
        },
      },
    );

    if (seenByUsers.length > 0) {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
        {
          receiverId: senderId,
          event: "messagesSeen",
          payload: {
            chatId,
            messageIds: [newMessage._id],
            seenByUsers,
          },
        },
        {
          headers: {
            "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
          },
        },
      );
    }
  } catch (socketError) {
    console.log("Socket emit failed:", socketError);
  }

  return newMessage;
};
