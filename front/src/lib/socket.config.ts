import { io, Socket } from "socket.io-client";
import Env from "./env";

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io(Env.BACKEND_URL, { autoConnect: false });
  }
  return socket;
};

export const connectSocket = (room: string, userName: string) => {
  const s = getSocket();
  s.auth = { room, userName };
  s.connect();
  return s;
};