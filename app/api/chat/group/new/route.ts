import { createGroupChatController } from "@/controllers/groupChat.controller";

export async function POST(req: Request) {
  return createGroupChatController(req as any);
}