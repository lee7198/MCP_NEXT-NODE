import React, { useState } from 'react';
import { AddPromptFormProps, PromptStatus } from '@/app/types';
import Spinner from '@/app/(main)/components/common/Spinner';
import { toast } from 'react-toastify';

export const AddPromptForm: React.FC<AddPromptFormProps> = ({
  onAdd,
  onCancel,
  isSaving,
}) => {
  const [newPrompt, setNewPrompt] = useState<PromptStatus>({
    promptContent: '',
    promptName: '',
  });
  const [errors, setErrors] = useState<{
    promptName?: string;
    promptContent?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { promptName?: string; promptContent?: string } = {};

    if (!newPrompt.promptName.trim()) {
      newErrors.promptName = '프롬프트 이름을 입력해주세요.';
      toast.error(newErrors.promptName);
    }

    if (!newPrompt.promptContent.trim()) {
      newErrors.promptContent = '프롬프트 내용을 입력해주세요.';
      toast.error(newErrors.promptContent);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(newPrompt);
    }
  };

  const handleInputChange = (field: keyof PromptStatus, value: string) => {
    setNewPrompt((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      <div className="col-span-3">
        <input
          type="text"
          value={newPrompt.promptName}
          onChange={(e) => handleInputChange('promptName', e.target.value)}
          placeholder="Prompt Name"
          className={`w-full rounded-md border px-2 text-sm placeholder-gray-500 disabled:animate-pulse disabled:bg-gray-200 dark:placeholder-gray-400 ${
            errors.promptName
              ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100'
              : 'border-gray-300 bg-white text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100'
          }`}
          disabled={isSaving}
        />
      </div>
      <div className="col-span-7">
        <textarea
          value={newPrompt.promptContent}
          onChange={(e) => handleInputChange('promptContent', e.target.value)}
          placeholder="Prompt 내용을 작성 해주세요."
          rows={3}
          maxLength={3900}
          className={`w-full resize-none rounded-md border px-2 py-1 text-sm placeholder-gray-500 disabled:animate-pulse disabled:bg-gray-200 dark:placeholder-gray-400 ${
            errors.promptContent
              ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100'
              : 'border-gray-300 bg-white text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100'
          }`}
          disabled={isSaving}
        />
      </div>

      <div className="col-span-2 flex justify-between gap-2">
        {isSaving ? (
          <div className="flex w-full items-center justify-center">
            <Spinner size={8} />
          </div>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 disabled:bg-gray-100 disabled:hover:bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              disabled={isSaving}
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              className="w-full cursor-pointer rounded-md bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-800 disabled:bg-gray-100 disabled:hover:bg-gray-600 dark:bg-zinc-700 dark:hover:bg-zinc-600"
              disabled={isSaving}
            >
              추가
            </button>
          </>
        )}
      </div>
    </div>
  );
};
