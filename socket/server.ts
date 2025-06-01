import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import type { Socket } from 'socket.io';
import type { Request, Response } from 'express';
import { ClientInfo, ResponseClient } from '@/app/types/socket';

// 연결된 클라이언트 정보를 저장할 Map
export const connectedClients = new Map<string, ClientInfo>();

const expressApp = express();
const server = createServer(expressApp);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Socket.IO 처리
io.on('connection', (socket: Socket) => {
  console.log('Client connected:', socket.id);

  // 클라이언트 기본 정보 저장
  connectedClients.set(socket.id, {
    uuid: socket.id,
    connectedAt: new Date(),
    lastActivity: new Date(),
    clientId: '',
  });

  // 연결된 클라이언트 목록 브로드캐스트
  io.emit('clients_update', Array.from(connectedClients.values()));

  // 초기 client_init 이벤트 처리
  socket.on('client_init', (data: ResponseClient) => {
    const clientInfo = connectedClients.get(socket.id);
    if (clientInfo) {
      clientInfo.lastActivity = new Date();
      clientInfo.clientId = data.clientId;
      connectedClients.set(socket.id, clientInfo);

      io.emit('clients_update', Array.from(connectedClients.values()));
    }
  });

  // 클라이언트로부터의 ping 이벤트 처리
  socket.on('client_ping', (data: ResponseClient) => {
    try {
      console.log('Received client_ping from:', socket.id, 'with data:', data);
      const clientInfo = connectedClients.get(socket.id);
      if (clientInfo) {
        clientInfo.lastActivity = new Date();
        if (data && data.clientId) {
          clientInfo.clientId = data.clientId;
        }
        connectedClients.set(socket.id, clientInfo);
        console.log(
          `[Ping] ${clientInfo.clientId} (${socket.id}) is alive at ${clientInfo.lastActivity.toISOString()}`
        );
        io.emit('clients_update', Array.from(connectedClients.values()));
      } else {
        console.log('Client info not found for socket:', socket.id);
      }
    } catch (err) {
      console.error('Error handling client_ping:', err);
    }
  });

  // 테스트용 ping 이벤트 처리
  socket.on('test_ping', (targetClientId: string) => {
    try {
      console.log('Test ping requested for client:', targetClientId);
      // 해당 clientId를 가진 클라이언트 찾기
      const targetClient = Array.from(connectedClients.values()).find(
        (client) => client.clientId === targetClientId
      );

      if (targetClient) {
        // 해당 클라이언트의 소켓에 ping 이벤트 전송
        io.to(targetClient.uuid).emit('force_ping');
        console.log('Test ping sent to client:', targetClientId);
      } else {
        console.log('Target client not found:', targetClientId);
      }
    } catch (err) {
      console.error('Error handling test_ping:', err);
    }
  });

  // 클라이언트 연결 해제
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    connectedClients.delete(socket.id);
    io.emit('clients_update', Array.from(connectedClients.values()));
  });
});

// 연결된 클라이언트 정보를 제공하는 API
expressApp.get('/api/clients', (req: Request, res: Response) => {
  res.json(Array.from(connectedClients.values()));
});

const PORT = 3001;

try {
  server.listen(PORT, () => {
    console.log(`> Socket.IO server ready on http://localhost:${PORT}`);
  });
} catch (err) {
  if (err instanceof Error) {
    if ('code' in err && err.code === 'EADDRINUSE') {
      console.error(
        `포트 ${PORT}가 이미 사용 중입니다. 다른 포트를 사용하거나 기존 프로세스를 종료해주세요.`
      );
    } else {
      console.error('서버 시작 중 에러 발생:', err.message);
    }
  }
  process.exit(1);
}
