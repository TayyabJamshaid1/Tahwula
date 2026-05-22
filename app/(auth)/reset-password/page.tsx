import { Suspense } from "react";
import ResetComponent from "./ResetPassword";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetComponent />
    </Suspense>
  );
}