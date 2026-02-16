"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";

  return (
    <html>
      <body className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-lg w-full">
          <h1 className="text-2xl font-bold text-red-600">
            Something went wrong
          </h1>

          <p className="text-gray-600 mt-2">
            We’re having trouble loading this page.
          </p>

          {/* ✅ Safe message for users */}
          <p className="text-sm text-gray-500 mt-2">
            {error.message || "Unexpected error occurred"}
          </p>

          {/* ✅ Developer details (stack trace) */}
          {(isDev || showDetails) && error.stack && (
            <pre className="mt-4 text-left bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              {error.stack}
            </pre>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button onClick={reset}>Try again</Button>

            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </Button>

            {!isDev && (
              <Button
                variant="ghost"
                onClick={() => setShowDetails((v) => !v)}
              >
                {showDetails ? "Hide details" : "Show details"}
              </Button>
            )}
          </div>

          {/* Optional: error digest */}
          {error.digest && (
            <p className="text-xs text-gray-400 mt-4">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
