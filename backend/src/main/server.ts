import http from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';
import { buildContainer } from './container';
import { createApp } from './app';
import { setupSocketHandlers } from '../presentation/websocket/socketHandler';

const io = new SocketIOServer({
  cors: {
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  }
});

const container = buildContainer(io);
setupSocketHandlers(io, container.tokenService);

const app = createApp(container);
const server = http.createServer(app);

io.attach(server);

const LOT_CHECK_INTERVAL_MS = 5000;
setInterval(async () => {
  try {
    await container.useCases.closeExpiredLots.execute();
  } catch (err) {
    console.error('Erro ao verificar encerramento de lotes expirados:', err);
  }
}, LOT_CHECK_INTERVAL_MS);

server.listen(env.PORT, () => {
  console.log(`Servidor backend rodando na porta ${env.PORT} em modo ${env.NODE_ENV}`);
});
