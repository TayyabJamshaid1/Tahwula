import { deleteGroupController } from "@/controllers/groupChat.controller";

export async function DELETE(
  req: Request,
  context: {
    params: Promise<{
      chatId: string;
    }>;
  },
) {
  const { chatId } = await context.params;

  return deleteGroupController(req as any, chatId);
}