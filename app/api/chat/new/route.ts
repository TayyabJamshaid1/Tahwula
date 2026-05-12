import { createNewChatController } from "@/controllers/chat.controller";

export async function POST(req: Request) {
  return createNewChatController(req as any);
}