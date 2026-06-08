import Chat from "@/models/Chat";
import Message from "@/models/Messages";
import { SystemActions } from "@/lib/SystemActions";

export const createSystemMessage = async ({
  chatId,
  sender,
  text,
  action,
}: {
  chatId: string;
  sender: string;
  text: string;
  action: SystemActions;
}) => {
  const systemMessage = await Message.create({
    chatId,
    sender,
    text,
    messageType: "system",
    system: {
      action,
      text,
    },
    seenBy: [],
  });

  await Chat.findByIdAndUpdate(chatId, {
    latestMessage: {
      text,
      sender,
    },
    updatedAt: new Date(),
  });

  return systemMessage;
};