// frontend/components/SocketContext.tsx
"use client";

import { useAppSelector } from "@/app/store/hooks";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: string[];
}

interface ProviderProps {
  children: React.ReactNode;
}

const SocketCtx = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({ children }: ProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const user = useAppSelector((state) => state?.auth?.user);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) {
      // Clean up socket if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    
    if (!socketUrl) {
      console.error("❌ NEXT_PUBLIC_SOCKET_URL is not defined");
      return;
    }

    console.log("🔌 Connecting to Socket.IO at:", socketUrl);
    console.log("👤 With userId:", user._id);

    // Create socket connection
    const newSocket = io(socketUrl, {
      query: { userId: user._id },
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      withCredentials: true,
      autoConnect: true,
      // Add forceNew for production to ensure fresh connection
      forceNew: true
    });

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("✅ Socket.IO connected successfully! ID:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket.IO connection error:", error.message);
      console.error("Full error details:", error);
      
      // Try to reconnect with polling only if websocket fails
      if (error.message.includes("websocket")) {
        console.log("⚠️ WebSocket failed, trying polling transport...");
        newSocket.io.opts.transports = ["polling"];
        newSocket.connect();
      }
    });

    newSocket.on("disconnect", (reason) => {
      console.log("🔌 Socket.IO disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected, reconnect manually
        newSocket.connect();
      }
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket.IO reconnected after", attemptNumber, "attempts");
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Socket.IO reconnection attempt:", attemptNumber);
    });

    newSocket.on("reconnect_error", (error) => {
      console.error("❌ Socket.IO reconnection error:", error.message);
    });

    newSocket.on("getOnlineUsers", (users: string[]) => {
      console.log("👥 Online users updated:", users);
      setOnlineUsers(users);
    });

    // Store socket in ref and state
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount or userId change
    return () => {
      console.log("🧹 Cleaning up socket connection for user:", user._id);
      if (newSocket) {
        newSocket.off("connect");
        newSocket.off("connect_error");
        newSocket.off("disconnect");
        newSocket.off("reconnect");
        newSocket.off("reconnect_attempt");
        newSocket.off("reconnect_error");
        newSocket.off("getOnlineUsers");
        newSocket.disconnect();
      }
      if (socketRef.current === newSocket) {
        socketRef.current = null;
      }
    };
  }, [user?._id]);

  return (
    <SocketCtx.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketCtx.Provider>
  );
};

export const SocketData = () => useContext(SocketCtx);