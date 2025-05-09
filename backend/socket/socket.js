import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: [
			"http://localhost:5173", 
			"http://localhost:5174", 
			"https://insta-kilo-9asl.vercel.app", // Add this primary frontend URL
			"https://insta-kilo-9asl-en8cqa9vu-rehans-projects-bda1d4c6.vercel.app", // Add this specific deployment URL if needed
			"https://insta-kilo-9asl-4pjg691g9-rehans-projects-bda1d4c6.vercel.app"  // Add this NEW specific frontend URL
		],
		methods: ["GET", "POST"],
		// credentials: true, // Add if your socket connection relies on cookies from the frontend
	},
});

const userSocketMap = {}; // this map stores socket id corresponding the user id; userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId) {
		userSocketMap[userId] = socket.id;
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		if (userId) {
			delete userSocketMap[userId];
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, server, io };
