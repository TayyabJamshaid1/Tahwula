import { sendMessageController } from   "@/controllers/chat.controller";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  return sendMessageController(req);
}