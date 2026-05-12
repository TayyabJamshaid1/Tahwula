import { userProfileController } from "@/controllers/auth.controller";

export async function GET() {
  return userProfileController();
}