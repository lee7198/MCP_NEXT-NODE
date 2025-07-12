import React, { useState } from 'react';
import { AddUserFormProps } from '@/app/types';
import { UserListRes } from '@/app/types';
import Spinner from '@/app/(main)/components/common/Spinner';
import { toast } from 'react-toastify';

export const AddUserForm: React.FC<AddUserFormProps> = ({
  onAdd,
  onCancel,
  isSaving = false,
}) => {
  const [newUser, setNewUser] = useState<Partial<UserListRes>>({
    USERNAME: '',
    EMAIL: '',
    USE_YON: 'Y',
  });
  const [errors, setErrors] = useState<{
    USERNAME?: string;
    EMAIL?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { USERNAME?: string; EMAIL?: string } = {};

    if (!newUser.USERNAME?.trim()) {
      newErrors.USERNAME = '사용자 이름을 입력해주세요.';
      toast.error(newErrors.USERNAME);
    }

    if (!newUser.EMAIL?.trim()) {
      newErrors.EMAIL = '이메일을 입력해주세요.';
      toast.error(newErrors.EMAIL);
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.EMAIL)) {
      newErrors.EMAIL = '올바른 이메일 형식을 입력해주세요.';
      toast.error(newErrors.EMAIL);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onAdd(newUser);
    }
  };

  const handleInputChange = (field: keyof UserListRes, value: string) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
    // 입력 시 해당 필드의 에러 메시지 제거 (USERNAME, EMAIL만 에러 처리)
    if (field === 'USERNAME' && errors.USERNAME) {
      setErrors((prev) => ({ ...prev, USERNAME: undefined }));
    }
    if (field === 'EMAIL' && errors.EMAIL) {
      setErrors((prev) => ({ ...prev, EMAIL: undefined }));
    }
  };

  return (
    <div className="grid grid-cols-8 gap-4 p-4">
      <div className="col-span-2">
        <input
          type="text"
          value={newUser.USERNAME}
          onChange={(e) => handleInputChange('USERNAME', e.target.value)}
          placeholder="이름"
          className={`w-full rounded-md border px-2 text-sm placeholder-gray-500 disabled:animate-pulse disabled:bg-gray-200 dark:placeholder-gray-400 ${
            errors.USERNAME
              ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100'
              : 'border-gray-300 bg-white text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100'
          }`}
          disabled={isSaving}
        />
      </div>
      <div className="col-span-2">
        <input
          type="email"
          value={newUser.EMAIL}
          onChange={(e) => handleInputChange('EMAIL', e.target.value)}
          placeholder="이메일"
          className={`w-full rounded-md border px-2 text-sm placeholder-gray-500 disabled:animate-pulse disabled:bg-gray-200 dark:placeholder-gray-400 ${
            errors.EMAIL
              ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100'
              : 'border-gray-300 bg-white text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100'
          }`}
          disabled={isSaving}
        />
      </div>
      <div>
        <select
          value={newUser.USE_YON}
          onChange={(e) =>
            setNewUser((prev) => ({
              ...prev,
              USE_YON: e.target.value as 'Y' | 'N',
            }))
          }
          className="rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 disabled:animate-pulse disabled:bg-gray-200 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
          disabled={isSaving}
        >
          <option value="Y">활성</option>
          <option value="N">비활성</option>
        </select>
      </div>
      <div className="flex items-center justify-end gap-2"></div>
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
