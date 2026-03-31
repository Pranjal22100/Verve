import { Server, Socket } from "socket.io";
import { produceMessage } from "./helper.js";

interface CustomSocket extends Socket {
  room?: string;
  userName?: string;
}

export function setupSocket(io: Server) {
  io.use((socket: CustomSocket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) return next(new Error("Invalid room"));
    socket.room = room;
    socket.userName = socket.handshake.auth.userName || null;
    next();
  });

  io.on("connection", (socket: CustomSocket) => {
    socket.join(socket.room);

    if (socket.userName) {
      // 1. Tell the NEW user who is already online in this room
      const roomSockets = io.sockets.adapter.rooms.get(socket.room) || new Set();
      const onlineUsers: string[] = [];
      roomSockets.forEach((socketId) => {
        if (socketId !== socket.id) {
          const s = io.sockets.sockets.get(socketId) as CustomSocket;
          if (s?.userName) onlineUsers.push(s.userName);
        }
      });
      socket.emit("online_users", onlineUsers);

      // 2. Tell EVERYONE ELSE in the room that this user joined
      socket.to(socket.room).emit("user_joined", {
        name: socket.userName,
        created_at: new Date().toISOString(),
      });
    }

    socket.on("message", async (data) => {
      try {
        await produceMessage("chats", data);
      } catch (error) {
        console.log("The kafka produce error is", error);
      }
      socket.to(socket.room).emit("message", data);
    });

    socket.on("disconnect", () => {
      if (socket.userName) {
        socket.to(socket.room).emit("user_left", { name: socket.userName });
      }
    });
  });
}