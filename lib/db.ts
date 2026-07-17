// lib/db.ts
import mongoose from "mongoose";
const MONGODB_URL = process.env.MONGODB_URL!;

if (!MONGODB_URL) {
  throw new Error("Please define MONGODB_URL in env variables");
}

// 👇 Global cache (prevents multiple connections in dev / hot reload)
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function ConnectToDatabase() {
  try {
    // ✅ If already connected → reuse connection
    if (cached.conn) {
      return cached.conn;
    }

    // ✅ If connection is in progress → wait for it
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URL, {
        maxPoolSize: 10, // ✅ control concurrent connections
        bufferCommands: false, // ✅ fail fast instead of buffering
        serverSelectionTimeoutMS: 5000, // ✅ fail in 5s if DB unreachable
      });
    }

    cached.conn = await cached.promise;

    return cached.conn;
  } catch (error: any) {
    console.error("❌ MongoDB connection error:", error?.message);

    // ❗ IMPORTANT: reset promise so next request can retry
    cached.promise = null;

    // 👉 Option 1 (recommended for backend APIs)
    throw error;

    // 👉 Option 2 (use this if you want NO crashes anywhere)
    // return null;
  }
}