import { resetPasswordController } from "@/controllers/auth.controller";

export async function POST(req: Request) {
  return resetPasswordController(req as any);
}