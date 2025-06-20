'use client';

import { PaperPlaneTiltIcon } from '@phosphor-icons/react';
import { MessageInputProps } from '@/app/types';
import { useState } from 'react';

export default function MessageInput({
  message,
  setMessage,
  onSendMessage,
  isDisabled,
  textareaRef,
  boxHeight,
}: MessageInputProps) {
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSendMessage();
      }}
      className={`flex w-full items-end justify-center overflow-y-hidden px-4 pb-4 ${message ? 'gap-2' : 'gap-0'}`}
    >
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        placeholder="메시지를 입력하세요..."
        className={`focus:border-main/50 max-h-48 min-h-20 flex-1 resize-none overflow-y-auto rounded-lg border border-gray-300 p-2 leading-normal transition-all duration-300 focus:outline-none ${message ? 'mr-0 w-auto' : 'mr-0 w-full'} ${isDisabled ? 'animate-pulse bg-gray-200' : 'bg-white'}`}
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
          className={`bg-main hover:bg-main/80 h-full w-full grow-0 cursor-pointer rounded-lg px-4 py-4 text-white focus:outline-none ${isDisabled ? 'w-0 opacity-0' : 'opacity-100'}`}
          tabIndex={message ? 0 : -1}
          disabled={!message.trim() || isDisabled}
        >
          <PaperPlaneTiltIcon size={18} />
        </button>
      </div>
    </form>
  );
}
