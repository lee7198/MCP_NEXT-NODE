'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SaveServerForm } from '@/app/types';
import { useMutation } from '@tanstack/react-query';
import { server_management } from '@/app/services/api';
import { toast } from 'react-toastify';
import Spinner from '@/app/(main)/components/common/Spinner';

export default function New() {
  const router = useRouter();
  const [formData, setFormData] = useState<SaveServerForm>({
    SERVERNAME: '',
    COMMENT: '',
  });
  const [errors, setErrors] = useState<{
    SERVERNAME?: string;
    COMMENT?: string;
  }>({});

  const saveServerMutation = useMutation({
    mutationFn: (data: SaveServerForm) => server_management.saveServer(data),
    onSuccess: () => {
      toast.success('저장이 완료되었습니다');
      router.push('/settings/servers');
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const validateForm = () => {
    const newErrors: { SERVERNAME?: string; COMMENT?: string } = {};

    if (!formData.SERVERNAME?.trim()) {
      newErrors.SERVERNAME = '서버명을 입력해주세요.';
      toast.error(newErrors.SERVERNAME);
    }

    if (!formData.COMMENT?.trim()) {
      newErrors.COMMENT = '서버 설명을 입력해주세요.';
      toast.error(newErrors.COMMENT);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      saveServerMutation.mutate(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // 입력 시 해당 필드의 에러 메시지 제거
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
        신규 서버 등록
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="SERVERNAME"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              서버명
            </label>
            <input
              type="text"
              id="SERVERNAME"
              name="SERVERNAME"
              value={formData.SERVERNAME}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:outline-none disabled:animate-pulse disabled:bg-gray-200 dark:placeholder-gray-400 dark:disabled:bg-zinc-600 ${
                errors.SERVERNAME
                  ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-gray-300 focus:ring-1 focus:ring-gray-500 dark:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-100'
              }`}
              placeholder="서버명을 입력하세요"
              maxLength={100}
              disabled={saveServerMutation.isPending}
            />
          </div>

          <div>
            <label
              htmlFor="COMMENT"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              설명
            </label>
            <textarea
              id="COMMENT"
              name="COMMENT"
              value={formData.COMMENT}
              onChange={handleChange}
              rows={4}
              className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm placeholder-gray-500 focus:outline-none disabled:animate-pulse disabled:bg-gray-200 dark:placeholder-gray-400 dark:disabled:bg-zinc-600 ${
                errors.COMMENT
                  ? 'border-red-500 bg-red-50 text-red-900 dark:border-red-400 dark:bg-red-900/20 dark:text-red-100'
                  : 'border-gray-300 bg-white text-gray-900 focus:border-gray-300 focus:ring-1 focus:ring-gray-500 dark:border-zinc-400 dark:bg-zinc-800 dark:text-zinc-100'
              }`}
              placeholder="서버에 대한 설명을 입력하세요"
              maxLength={100}
              disabled={saveServerMutation.isPending}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saveServerMutation.isPending}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:border-0 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-500"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saveServerMutation.isPending}
            className="flex cursor-pointer items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 dark:border-0 dark:bg-zinc-200 dark:text-zinc-800 dark:hover:bg-zinc-400"
          >
            {saveServerMutation.isPending ? (
              <Spinner size={4} color="fill-gray-400" />
            ) : (
              '등록'
            )}
          </button>
        </div>
      </form>
    </>
  );
}
