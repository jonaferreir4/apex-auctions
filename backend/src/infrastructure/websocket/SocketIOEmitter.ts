import { Server as SocketIOServer } from 'socket.io';
import { IWebSocketEmitter } from '../../application/ports/IWebSocketEmitter';

export class SocketIOEmitter implements IWebSocketEmitter {
  constructor(private io: SocketIOServer) { }

  emitToLot(lotId: string, event: string, payload: unknown): void {
    this.io.to(`lot:${lotId}`).emit(event, payload);
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.io.to(`user:${userId}`).emit(event, payload);
  }

  broadcast(event: string, payload: unknown): void {
    this.io.emit(event, payload);
  }
}
