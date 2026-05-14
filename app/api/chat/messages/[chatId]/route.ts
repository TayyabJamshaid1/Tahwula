import { getMessagesByChatController } from "@/controllers/chat.controller";

export async function GET(
  req: Request,
  context: {
    params: Promise<{
      chatId: string;
    }>;
  }
) {
  const { chatId } =
    await context.params;

  return getMessagesByChatController(
    req as any,
    chatId
  );
}