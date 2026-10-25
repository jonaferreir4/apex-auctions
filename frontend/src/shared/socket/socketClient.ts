import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socketInstance: Socket | null = null;

export function getSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    const token = localStorage.getItem('@leilao:token');
    if (token) {
      socketInstance.emit('auth_user', { token });
    }
  }

  return socketInstance;
}

export function authenticateSocket(token: string): void {
  const socket = getSocket();
  socket.emit('auth_user', { token });
}

export function joinLotRoom(lotId: string): void {
  const socket = getSocket();
  socket.emit('join_lot', { lotId });
}

export function leaveLotRoom(lotId: string): void {
  const socket = getSocket();
  socket.emit('leave_lot', { lotId });
}
