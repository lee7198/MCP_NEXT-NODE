import React, { useState } from 'react';
import { AddUserFormProps } from '@/app/types/management';
import { UserListRes } from '@/app/types';

export const AddUserForm: React.FC<AddUserFormProps> = ({
  onAdd,
  onCancel,
}) => {
  const [newUser, setNewUser] = useState<Partial<UserListRes>>({
    USERNAME: '',
    EMAIL: '',
    USE_YON: 'Y',
  });

  const handleSubmit = () => {
    if (!newUser.USERNAME || !newUser.EMAIL) {
      return;
    }
    onAdd(newUser);
  };

  return (
    <div className="grid grid-cols-8 gap-4 border-b border-gray-200 p-4">
      <div className="col-span-2">
        <input
          type="text"
          value={newUser.USERNAME}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, USERNAME: e.target.value }))
          }
          placeholder="이름"
          className="w-full rounded-md border border-gray-300 px-2 text-sm"
        />
      </div>
      <div className="col-span-2">
        <input
          type="email"
          value={newUser.EMAIL}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, EMAIL: e.target.value }))
          }
          placeholder="이메일"
          className="w-full rounded-md border border-gray-300 px-2 text-sm"
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
          className="rounded-md border border-gray-300 px-2 text-sm"
        >
          <option value="Y">활성</option>
          <option value="N">비활성</option>
        </select>
      </div>
      <div className="flex items-center justify-end gap-2"></div>
      <div className="col-span-2 flex justify-between gap-2">
        <button
          onClick={onCancel}
          className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="w-full cursor-pointer rounded-md bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700"
        >
          추가
        </button>
      </div>
    </div>
  );
};
