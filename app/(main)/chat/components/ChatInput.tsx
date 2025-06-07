'use client';

import { PaperPlaneTiltIcon } from '@phosphor-icons/react';
import React, { useState, useRef, useEffect } from 'react';
import type { ChatInputProps } from '@/app/types';

export default function ChatInput({
  onSendMessage,
  isDisabled = false,
  USER_ID,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [boxHeight, setBoxHeight] = useState(1);

  const sendMessage = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage({ CONTENT: message.trim(), USER_ID });
      setMessage('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Shift+Enter는 기본 동작(줄바꿈)을 허용
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const maxRows = 6;
      const lines = message.split('\n').length;
      const rows = Math.min(lines, maxRows);
      setBoxHeight(rows);
    }
  }, [message]);

  return (
    <div className="flex flex-col">
      <div className="border-t py-2">MCP: SERVER:</div>
      <form
        onSubmit={handleSubmit}
        className={`flex items-end overflow-y-hidden ${message ? 'gap-2' : 'gap-0'}`}
      >
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          className={`focus:border-main/50 max-h-48 min-h-12 flex-1 resize-none overflow-y-auto rounded-lg border border-gray-300 p-2 leading-normal transition-all duration-300 focus:outline-none ${message ? 'mr-0 w-auto' : 'mr-0 w-full'} ${isDisabled ? 'bg-gray-300' : ''}`}
          rows={boxHeight}
          disabled={isDisabled}
        />
        <div
          className={`flex items-end transition-all duration-300 ${
            message
              ? 'ml-0 h-full w-14 scale-100 opacity-100'
              : 'pointer-events-none ml-0 w-0 scale-90 opacity-0'
          } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <button
            type="submit"
            className="bg-main hover:bg-main/80 h-full grow-0 cursor-pointer rounded-lg px-4 py-4 text-white focus:outline-none"
            tabIndex={message ? 0 : -1}
            disabled={!message.trim() || isDisabled}
          >
            <PaperPlaneTiltIcon size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
