import cloudinary from "@/lib/cloudinary";
import Chat from "@/models/Chat";
import Message from "@/models/Messages";
import User from "@/models/User";
import axios from "axios";
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
    (currentUserId: string) => currentUserId.toString() === userId.toString(),
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
  console.log(
    process.env.NEXT_PUBLIC_SOCKET_URL,
    "process.env.NEXT_PUBLIC_SOCKET_URL",
  );

  // EMIT SOCKET EVENT TO RECEIVER
  // ONLY IF THERE ARE NEWLY SEEN MESSAGES
  if (messagesToMarkSeen.length > 0) {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit`,
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
      console.log("Socket emit failed:", socketError);
    }
  }

  return {
    messages,
    user: otherUser,
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

  // FIND CHAT
  const chat = await Chat.findById(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }
console.log(chat,"chat");

  // SECURITY CHECK
  const isUserInChat = chat.users.some(
    (userId: string) => userId.toString() === senderId.toString(),
  );

  if (!isUserInChat) {
    throw new Error("You are not participant of this chat");
  }
console.log(isUserInChat,"isUserInChat");

  // OTHER USER
  const otherUserId = chat.users.find(
    (userId: string) => userId.toString() !== senderId.toString(),
  );

  if (!otherUserId) {
    throw new Error("Other user not found");
  }
console.log(otherUserId,"otherUserId");

  // =========================================
  // CHECK RECEIVER CHAT ROOM STATUS
  // =========================================
  console.log(
    process.env.NEXT_PUBLIC_SOCKET_URL,
    "process.env.NEXT_PUBLIC_SOCKET_URL",
  );

  const roomCheckResponse = await axios.post(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/check-room`,
    {
      receiverId: otherUserId.toString(),
      chatId,
    },
    {
      headers: {
        "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
      },
    },
  );
  console.log(roomCheckResponse.data, "room check response");
  const isReceieverInChatRoom = roomCheckResponse.data.isInRoom;

  // =========================================
  // IMAGE UPLOAD
  // =========================================

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

  // =========================================
  // MESSAGE DATA
  // =========================================

  const messageData: any = {
    chatId,
    sender: senderId,
    text: text || "",
    image: imageData,
    messageType: image ? "image" : "text",

    // IMPORTANT
    seen: isReceieverInChatRoom,

    seenAt: isReceieverInChatRoom ? new Date() : undefined,
  };

  // =========================================
  // SAVE MESSAGE
  // =========================================

  const newMessage = await Message.create(messageData);

  // =========================================
  // UPDATE CHAT
  // =========================================

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: {
      text: image ? "Image" : text,

      sender: senderId,
    },

    updatedAt: new Date(),
  });

  // =========================================
  // SOCKET EMITS
  // =========================================

  await axios.post(
    `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-message`,
    {
      chatId,

      senderId,

      receiverId: otherUserId.toString(),

      message: newMessage,

      isReceieverInChatRoom,
    },
    {
      headers: {
        "x-internal-secret": process.env.INTERNAL_SOCKET_SECRET,
      },
    },
  );

  return newMessage;
};
