'use client';

import React from 'react';
import { useState, useEffect, useRef } from 'react';

export default function page() {
  // const [message, setMessage] = useState('');
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  // const [recipientId, setRecipientId] = useState('');
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = async () => {
      await fetch('/api/ws'); // WebSocket 서버 초기화
      const ws = new WebSocket('ws://localhost:3001');

      ws.onopen = () => {
        console.log('WebSocket connection established');
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
      };

      socketRef.current = ws;
    };

    connectWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="mx-auto flex h-[calc(100svh-3rem)] max-w-6xl flex-col px-2 pb-2">
      page
    </div>
  );
}
