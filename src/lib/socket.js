// src/lib/socket.js
import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize the socket (singleton)
 * @param {string} url - Socket server url
 * @returns socket instance
 */
export function initSocket(url = process.env.NEXT_PUBLIC_SOCKET_URL) {
  if (!socket) {
    socket = io(url, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
}

export function getSocket() {
  return socket;
}
