import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { ClientInfo } from '@/app/types/socket';
import { pingStatus } from '../types';

export const useSocket = (serverName: string) => {
  const [socketInstance, setSocketInstance] = useState<ReturnType<
    typeof io
  > | null>(null);
  const [pingStatus, setPingStatus] = useState<pingStatus>('idle');
  const [clients, setClients] = useState<ClientInfo[]>([]);

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

    return () => {
      socket.off('clients_update');
      socket.disconnect();
    };
  }, []); // serverName 의존성 제거

  // ping 테스트 핸들러
  const handleTestPing = () => {
    if (socketInstance) {
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

  return {
    clients,
    pingStatus,
    handleTestPing,
  };
};
