import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (userId: string) => {
  if (!socket && userId) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      query: { userId },
    });
  }

  return socket;
};
export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};