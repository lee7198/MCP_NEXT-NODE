// import { SocketClient } from '@/app/types';
// import { NextResponse } from 'next/server';
// import { WebSocketServer } from 'ws';

// let wss: WebSocketServer | null = null;
// let clients: SocketClient[] = [];

// export async function GET() {
//   if (!wss) {
//     console.log('WebSocket server is initializing');

//     // 포트번호는 원하는 포트로 변경하여 사용
//     wss = new WebSocketServer({ port: 3001 });

//     wss.on('connection', (ws) => {
//       console.log(ws);
//       const clientId = Math.random().toString(36).substring(7); // 고유한 사용자의 ID 값을 임의로 생성, DB를 연동시킨다면 해당 부분을 수정
//       clients.push({ id: clientId, ws });
//       console.log(`New client connected: ${clientId}`);

//       ws.send(JSON.stringify({ type: 'id', id: clientId }));

//       ws.on('message', (message: string) => {
//         const data = JSON.parse(message);

//         // 개인에게 메시지 전송
//         if (data.type === 'private') {
//           const recipient = clients.find((client) => client.id === data.to);
//           if (recipient) {
//             recipient.ws.send(
//               JSON.stringify({
//                 type: 'private',
//                 from: data.from,
//                 message: data.message,
//               })
//             );
//           }

//           // 전역으로 메시지 전송
//         } else if (data.type === 'broadcast') {
//           clients.forEach((client) => {
//             if (client.id !== data.from) {
//               client.ws.send(
//                 JSON.stringify({
//                   type: 'broadcast',
//                   from: data.from,
//                   message: data.message,
//                 })
//               );
//             }
//           });
//         }
//       });

//       ws.on('close', () => {
//         clients = clients.filter((client) => client.ws !== ws);
//         console.log(`Client disconnected: ${clientId}`);
//       });
//     });
//   }

//   return NextResponse.json({ message: 'WebSocket server is running' });
// }

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
