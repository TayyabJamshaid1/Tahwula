"use client";

import { useAppSelector } from "@/app/store/hooks";
import { createContext, use, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType{
    socket: Socket | null;
    onlineUsers:string[]
}

interface ProviderProps{
    children: React.ReactNode;
}
const SocketCtx = createContext<SocketContextType>({
    socket:null,
    onlineUsers:[]
});
export const SocketProvider = ({ children }:ProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const user = useAppSelector((state) => state.auth.user);
    useEffect(()=>{
        if (!user?._id) return
        const newSocket=io(process.env.NEXT_PUBLIC_SOCKET_URL!,{
            query:{userId:user._id}
        })
        setSocket(newSocket);
        newSocket.on("getOnlineUsers",(users:string[])=>{
            setOnlineUsers(users);
        })
        return()=>{
            newSocket.disconnect();
        }
    }, [user?._id])
    return (
     <SocketCtx.Provider value={{socket, onlineUsers}}>
        {children}
     </SocketCtx.Provider>
    );
};
export const SocketData = () => useContext(SocketCtx)