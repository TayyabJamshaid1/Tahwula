import { logoutController } from "@/controllers/auth.controller"

export async function GET() {
  return logoutController();
}