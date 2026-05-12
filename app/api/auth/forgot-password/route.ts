import { forgotPasswordController } from "@/controllers/auth.controller"

export async function POST(req: Request) {
  return forgotPasswordController(req as any);
}