'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SaveServerForm } from '@/app/types/server';
import { useMutation } from '@tanstack/react-query';
import { server_management } from '@/app/services/api';

export default function New() {
  const router = useRouter();
  const [formData, setFormData] = useState<SaveServerForm>({
    SERVERNAME: '',
    COMMENT: '',
  });

  const saveServerMutation = useMutation({
    mutationFn: (data: SaveServerForm) => server_management.saveServer(data),
    onSuccess: () => {
      router.push('/settings');
      router.refresh();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    saveServerMutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-8 text-2xl font-black">신규 서버 등록</h1>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
        <div>
          <label
            htmlFor="SERVERNAME"
            className="block text-sm font-medium text-gray-700"
          >
            서버명
          </label>
          <input
            type="text"
            id="SERVERNAME"
            name="SERVERNAME"
            value={formData.SERVERNAME}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            placeholder="서버명을 입력하세요"
            maxLength={100}
          />
        </div>

        <div>
          <label
            htmlFor="COMMENT"
            className="block text-sm font-medium text-gray-700"
          >
            설명
          </label>
          <textarea
            id="COMMENT"
            name="COMMENT"
            value={formData.COMMENT}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 focus:outline-none"
            placeholder="서버에 대한 설명을 입력하세요"
            maxLength={100}
          />
        </div>

        {saveServerMutation.isError && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {saveServerMutation.error?.message || '서버 등록에 실패했습니다.'}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={saveServerMutation.isPending}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {saveServerMutation.isPending ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
