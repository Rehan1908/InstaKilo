import io from 'socket.io-client';

let socket;

export const initializeSocket = (userId) => {
  const SOCKET_URL = import.meta.env.VITE_API_BASE_URL; // This will use the Vercel env variable
  socket = io(SOCKET_URL, { // MODIFIED to use environment variable
    query: { userId },
    transports: ['websocket'],
    // withCredentials: true, // if your backend socket server requires cookies/credentials
  });

  // ... rest of your socket initialization
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const getSocket = () => {
  return socket;
};