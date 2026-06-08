import { renameGroupController } from "@/controllers/groupChat.controller";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      chatId: string;
    }>;
  },
) {
  const { chatId } = await context.params;

  return renameGroupController(req as any, chatId);
}