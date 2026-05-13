"use client";

import { useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { useAppSelector, useAppDispatch } from "@/app/store/hooks";
import { setOnlineUsers } from "@/app/store/SocketSlice";

export default function SocketInitializer() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user?._id) return;

    const socket:any = getSocket(user._id);

    const handleOnlineUsers = (users: string[]) => {
      dispatch(setOnlineUsers(users));
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
    };
  }, [user?._id, dispatch]);

  return null;
}