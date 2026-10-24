import { Server as SocketIOServer, Socket } from 'socket.io';
import { ITokenService } from '../../application/ports/ITokenService';

export function setupSocketHandlers(io: SocketIOServer, tokenService: ITokenService) {
  io.on('connection', (socket: Socket) => {
    socket.on('auth_user', (data: { token: string }) => {
      try {
        if (!data?.token) return;
        const payload = tokenService.verify(data.token);
        socket.join(`user:${payload.userId}`);
      } catch {
        // Ignora token inválido no socket
      }
    });

    socket.on('join_lot', (data: { lotId: string }) => {
      if (data?.lotId) {
        socket.join(`lot:${data.lotId}`);
      }
    });

    socket.on('leave_lot', (data: { lotId: string }) => {
      if (data?.lotId) {
        socket.leave(`lot:${data.lotId}`);
      }
    });
  });
}
