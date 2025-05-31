import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { WebSocketServer, WebSocket } from 'ws';
import type { IncomingMessage, ServerResponse } from 'http';

// 클라이언트 타입 정의
interface SocketClient {
  id: string;
  ws: WebSocket;
}

// 환경 설정
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// WebSocket 서버 및 클라이언트 목록 초기화
const wss = new WebSocketServer({ port: 3001 });
const clients: SocketClient[] = [];

// WebSocket 연결 핸들링
wss.on('connection', (ws: WebSocket) => {
  const clientId = Math.random().toString(36).substring(7);
  clients.push({ id: clientId, ws });

  ws.send(JSON.stringify({ type: 'id', id: clientId }));

  ws.on('message', (message: string | Buffer) => {
    const parsed =
      typeof message === 'string' ? message : message.toString('utf-8');
    const data = JSON.parse(parsed);

    if (data.type === 'private') {
      const recipient = clients.find((c) => c.id === data.to);
      if (recipient) {
        recipient.ws.send(
          JSON.stringify({
            type: 'private',
            from: data.from,
            message: data.message,
          })
        );
      }
    } else if (data.type === 'broadcast') {
      clients.forEach((c) => {
        if (c.id !== data.from) {
          c.ws.send(
            JSON.stringify({
              type: 'broadcast',
              from: data.from,
              message: data.message,
            })
          );
        }
      });
    }
  });

  ws.on('close', () => {
    const index = clients.findIndex((c) => c.ws === ws);
    if (index !== -1) clients.splice(index, 1);
  });
});

// Next.js 앱 준비 후 HTTP 서버 시작
app.prepare().then(() => {
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const PORT = parseInt(process.env.PORT || '3000', 10);

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
    console.log('> WebSocket server running on ws://localhost:3001');
  });
});
