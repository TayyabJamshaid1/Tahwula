import { fetchAllChatUsers } from "@/controllers/auth.controller";

export async function GET() {
    return fetchAllChatUsers();
}