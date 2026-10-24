export interface IWebSocketEmitter {
  emitToLot(lotId: string, event: string, payload: unknown): void;
  emitToUser(userId: string, event: string, payload: unknown): void;
  broadcast(event: string, payload: unknown): void;
}
