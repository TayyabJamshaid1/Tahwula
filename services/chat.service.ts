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
  try {
    console.log("========== SEND MESSAGE SERVICE START ==========");

    console.log("senderId:", senderId);
    console.log("chatId:", chatId);
    console.log("text:", text);
    console.log("image:", image);

    // =========================================
    // VALIDATIONS
    // =========================================

    if (!chatId) {
      console.log("ERROR: ChatId missing");
      throw new Error("ChatId required");
    }

    if (!text && !image) {
      console.log("ERROR: Text and image both missing");
      throw new Error("Text or image required");
    }

    // =========================================
    // FIND CHAT
    // =========================================

    console.log("Finding chat...");

    const chat = await Chat.findById(chatId);

    console.log("Chat found:", chat);

    if (!chat) {
      console.log("ERROR: Chat not found");
      throw new Error("Chat not found");
    }

    // =========================================
    // SECURITY CHECK
    // =========================================

    console.log("Checking if user is in chat...");

    const isUserInChat = chat.users.some(
      (userId: string) => userId.toString() === senderId.toString(),
    );

    console.log("isUserInChat:", isUserInChat);

    if (!isUserInChat) {
      console.log("ERROR: User not participant");
      throw new Error("You are not participant of this chat");
    }

    // =========================================
    // OTHER USER
    // =========================================

    console.log("Finding other user...");

    const otherUserId = chat.users.find(
      (userId: string) => userId.toString() !== senderId.toString(),
    );

    console.log("otherUserId:", otherUserId);

    if (!otherUserId) {
      console.log("ERROR: Other user not found");
      throw new Error("Other user not found");
    }

    // =========================================
    // SOCKET URL CHECK
    // =========================================

    console.log(
      "NEXT_PUBLIC_SOCKET_URL:",
      process.env.NEXT_PUBLIC_SOCKET_URL,
    );

    console.log(
      "INTERNAL_SOCKET_SECRET:",
      process.env.INTERNAL_SOCKET_SECRET
        ? "SECRET EXISTS"
        : "SECRET MISSING",
    );

    // =========================================
    // ROOM CHECK API
    // =========================================

    console.log("Calling check-room API...");

    const roomCheckUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/check-room`;

    console.log("roomCheckUrl:", roomCheckUrl);

    const roomCheckResponse = await axios.post(
      roomCheckUrl,
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

    console.log("roomCheckResponse.data:", roomCheckResponse.data);

    const isReceieverInChatRoom = roomCheckResponse.data.isInRoom;

    console.log(
      "isReceieverInChatRoom:",
      isReceieverInChatRoom,
    );

    // =========================================
    // IMAGE UPLOAD
    // =========================================

    let imageData;

    if (image) {
      console.log("Uploading image to cloudinary...");

      const bytes = await image.arrayBuffer();

      console.log("Image bytes created");

      const buffer = Buffer.from(bytes);

      console.log("Buffer created");

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "chat-images",
            },
            (error, result) => {
              if (error) {
                console.log("Cloudinary upload error:", error);
                reject(error);
              }

              console.log("Cloudinary upload success:", result);

              resolve(result);
            },
          )
          .end(buffer);
      });

      imageData = {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
      };

      console.log("imageData:", imageData);
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
      seen: isReceieverInChatRoom,
      seenAt: isReceieverInChatRoom ? new Date() : undefined,
    };

    console.log("messageData:", messageData);

    // =========================================
    // SAVE MESSAGE
    // =========================================

    console.log("Creating message...");

    const newMessage = await Message.create(messageData);

    console.log("newMessage:", newMessage);

    // =========================================
    // UPDATE CHAT
    // =========================================

    console.log("Updating chat latestMessage...");

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: {
        text: image ? "Image" : text,
        sender: senderId,
      },

      updatedAt: new Date(),
    });

    console.log("Chat updated successfully");

    // =========================================
    // EMIT MESSAGE API
    // =========================================

    console.log("Calling emit-message API...");

    const emitMessageUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}/chatRoutes/emit-message`;

    console.log("emitMessageUrl:", emitMessageUrl);

    const emitResponse = await axios.post(
      emitMessageUrl,
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

    console.log("emitResponse.data:", emitResponse.data);

    console.log("========== SEND MESSAGE SUCCESS ==========");

    return newMessage;
  } catch (error: any) {
    console.log("========== SEND MESSAGE ERROR ==========");

    console.log("Error message:", error.message);

    console.log("Axios response:", error?.response?.data);

    console.log("Axios status:", error?.response?.status);

    console.log("Full error:", error);

    throw error;
  }
};
