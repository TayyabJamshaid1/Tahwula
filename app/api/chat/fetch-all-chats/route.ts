import { fetchAllChatsController } from "@/controllers/chat.controller";

export async function GET() {
  return fetchAllChatsController();
}