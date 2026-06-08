import { leaveGroupController } from "@/controllers/groupChat.controller";

export async function PATCH(
  req: Request,
  context: {
    params: Promise<{
      chatId: string;
    }>;
  },
) {
  const { chatId } = await context.params;

  return leaveGroupController(req as any, chatId);
}