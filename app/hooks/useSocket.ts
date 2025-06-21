import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ClientInfo } from '@/app/types';
import { McpParamsRes, PingStatus, SaveChatRes } from '../types';

export const useSocket = (serverName?: string) => {
  const [socketInstance, setSocketInstance] = useState<ReturnType<
    typeof io
  > | null>(null);
  const [pingStatus, setPingStatus] = useState<PingStatus>('idle');
  const [clients, setClients] = useState<ClientInfo[]>([]);
  const [messageStatus, setMessageStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [mcpResponse, setMcpResponse] = useState<{
    response: string;
    timestamp: Date;
    messageId: number;
  } | null>(null);
  const [currentTargetId, setCurrentTargetId] = useState<string | null>(null);

  // 초기 클라이언트 정보 가져오기
  const fetchInitialClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      // console.log('init ', data);
      if (data.length > 0) setClients(data);
    } catch (error) {
      console.error('Failed to fetch initial clients:', error);
    }
  };

  // 소켓 연결 설정
  useEffect(() => {
    const socket = io('http://localhost:3001');
    setSocketInstance(socket);

    //init
    fetchInitialClients();

    // 클라이언트 업데이트 구독
    socket.on('clients_update', (updatedClients: ClientInfo[]) => {
      // console.log('Received updated clients:', updatedClients);
      setClients(updatedClients);
    });

    // MCP 응답 구독
    socket.on(
      'mcp_response_to_web',
      (data: {
        response: string;
        timestamp: Date;
        to: string;
        messageId: number;
      }) => {
        console.log('mcp 응답 : ', data);
        // 현재 타겟 클라이언트의 응답만 처리
        if (currentTargetId && data.to === currentTargetId) {
          console.log('Received MCP response for target client:', data);
          setMcpResponse({
            response: data.response,
            timestamp: data.timestamp,
            messageId: data.messageId,
          });
        }
      }
    );

    return () => {
      socket.off('clients_update');
      socket.off('mcp_response_to_web');
      socket.disconnect();
    };
  }, [currentTargetId]); // currentTargetId가 변경될 때마다 이펙트 재실행

  // ping 테스트 핸들러
  const handleTestPing = () => {
    if (serverName && socketInstance) {
      setPingStatus('loading');
      socketInstance.emit('test_ping', serverName);

      setTimeout(() => {
        setPingStatus('success');
        setTimeout(() => {
          setPingStatus('idle');
        }, 500);
      }, 1500);
    }
  };

  // 메시지 전송 핸들러
  const sendMessageWithMCP = ({
    messageData,
    arg,
  }: {
    // mcp agent id
    messageData: SaveChatRes;
    arg: McpParamsRes[];
  }) => {
    const targetClientId = messageData.MCP_SERVER;
    if (socketInstance && targetClientId) {
      setCurrentTargetId(targetClientId); // 타겟 클라이언트 ID 설정

      setMessageStatus('sending');
      //받는 agent, messageId, message, params
      socketInstance.emit('send_message', {
        targetClientId,
        messageId: messageData.id,
        message: messageData.CONTENT,
        arg,
      });

      // 메시지 전송 상태 업데이트를 위한 리스너
      socketInstance.once('message_sent', () => {
        setMessageStatus('success');
        setTimeout(() => {
          setMessageStatus('idle');
        }, 2000);
      });

      socketInstance.once('message_error', (error: Error) => {
        console.error('Failed to send message:', error);
        setMessageStatus('error');
        setTimeout(() => {
          setMessageStatus('idle');
        }, 2000);
      });
    }
  };

  return {
    clients,
    pingStatus,
    messageStatus,
    mcpResponse,
    currentTargetId,
    handleTestPing,
    sendMessageWithMCP,
  };
};
