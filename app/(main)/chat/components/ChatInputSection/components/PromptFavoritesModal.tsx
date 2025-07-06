import React, { useRef, useEffect } from 'react';
import { PromptFavoritesModalProps } from '@/app/types';
import { XIcon } from '@phosphor-icons/react/dist/ssr';

const PromptFavoritesModal: React.FC<PromptFavoritesModalProps> = ({
  isOpen,
  onClose,
  prompts,
  setMessage,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const setPromptMessage = (prompt: string) => {
    if (prompt) setMessage(prompt || '');
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div
      ref={modalRef}
      className="absolute bottom-12 left-40 z-20 max-w-96 rounded-lg bg-white p-4 shadow-2xl dark:bg-zinc-800 dark:shadow-zinc-900/50"
    >
      <div className="mb-2 flex items-start justify-between gap-4">
        <h3 className="font-bold text-gray-900 dark:text-zinc-100">
          프롬프트 즐겨찾기
        </h3>
        <button
          className="cursor-pointer rounded-full bg-gray-200 p-1 text-gray-700 hover:bg-gray-300 dark:bg-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-600"
          onClick={onClose}
        >
          <XIcon size={14} weight="bold" />
        </button>
      </div>
      <div className="max-h-52 overflow-y-auto">
        {prompts && prompts.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {prompts.map((prompt, idx) => (
              <button
                key={idx}
                className="relative flex aspect-[1.3333] w-24 cursor-pointer flex-col items-start rounded border text-xs hover:bg-gray-100 dark:hover:bg-zinc-700"
                onClick={() => {
                  setPromptMessage(prompt.PROMPT);
                }}
              >
                <div className="flex w-full gap-1 bg-gray-800 px-1 text-white dark:bg-zinc-100 dark:text-black">
                  <div className="font-black">{idx + 1}</div>
                  <div className="max-w-[4.5rem] truncate" title={prompt.TITLE}>
                    {prompt.TITLE}
                  </div>
                </div>
                <p className="p-1 text-left">
                  {prompt.PROMPT || JSON.stringify(prompt)}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            즐겨찾기 프롬프트가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptFavoritesModal;
