import React, { useState } from 'react';
import { AIResponseChatProps } from '@/app/types';
import TimeAgo from 'javascript-time-ago';
import ko from 'javascript-time-ago/locale/ko';
import MultiToSpan from '@/app/(main)/components/common/MultiToSpan';
import MarkdownStyle from '@/app/(main)/components/common/MarkdownStyle';
import {
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  CopyIcon,
} from '@phosphor-icons/react';

const splitAIMessage = (input: string) => {
  const thinkMatch = input.match(/<think>([\s\S]*?)<\/think>/);
  const thinkMessage = thinkMatch ? thinkMatch[1].trim() : '';

  const responseMessage = input
    .replace(/<think>[\s\S]*?<\/think>/, '')
    .trim()
    .replace('\n', '');

  return { thinkMessage, responseMessage };
};

export default function AIResponseItem({
  CONTENT,
  CREATED_AT,
}: AIResponseChatProps) {
  TimeAgo.addLocale(ko);
  const timeAgo = new TimeAgo('ko');
  const [isThinkMessageOpen, setIsThinkMessageOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const { thinkMessage, responseMessage } = splitAIMessage(CONTENT ?? '');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(responseMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  return (
    <div className="flex max-w-3/4 flex-col items-start gap-4">
      {thinkMessage && (
        <>
          <button
            className="active:bg-gray-20 flex w-full cursor-pointer flex-row items-center justify-between rounded-lg border border-gray-400 px-2 py-1 font-bold"
            onClick={() => setIsThinkMessageOpen(!isThinkMessageOpen)}
          >
            <div className="text-sm">🤖 AI가 생각한 내용</div>
            <div className="px-1">
              {isThinkMessageOpen ? (
                <CaretUpIcon size={16} />
              ) : (
                <CaretDownIcon size={16} />
              )}
            </div>
          </button>
          {/* AI Response */}
          {isThinkMessageOpen && (
            <div
              className={`${isThinkMessageOpen ? 'max-h-72' : 'h-0'} overflow-y-scroll text-sm transition-all duration-300`}
            >
              <MultiToSpan input={thinkMessage} />
            </div>
          )}
        </>
      )}

      <div className="text-gray-800">
        <div className="rounded-lg p-2 break-keep">
          <MarkdownStyle input={responseMessage} />
        </div>
        <div className="flex w-full items-center justify-between px-2 pt-1">
          <div className="text-xs">{timeAgo.format(new Date(CREATED_AT))}</div>
          <div
            className="cursor-pointer px-1 py-0.5 active:bg-gray-200"
            onClick={handleCopy}
          >
            {isCopied ? (
              <CheckCircleIcon weight="fill" size={12} color="#4bd85c" />
            ) : (
              <CopyIcon size={12} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
