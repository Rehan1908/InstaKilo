// src/services/socketService.js
import { io } from 'socket.io-client';

// Create socket connection outside Redux
let socket = null;

export const initializeSocket = (token) => {
  socket = io('http://localhost:3000', {
    auth: {
      token
    }
  });
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
  socket = null;
};