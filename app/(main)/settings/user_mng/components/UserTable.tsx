import React from 'react';
import { UserTableProps } from '@/app/types/management';

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  editedUsers,
  setEditedUsers,
  isPending,
}) => {
  return (
    <div className="overflow-auto rounded-lg bg-white shadow">
      {isPending ? (
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="my-1 h-4 w-12 animate-pulse rounded-lg bg-gray-300" />
          <div className="my-1 h-4 w-24 animate-pulse rounded-lg bg-gray-300" />
          <div className="my-1 h-4 w-10 animate-pulse rounded-lg bg-gray-300" />
          <div className="my-1 h-4 w-26 animate-pulse rounded-lg bg-gray-300" />
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {users.map((user) => {
            const isEditing = editedUsers[user.EMAIL];
            const currentUser = isEditing || user;

            return (
              <div
                key={user.EMAIL}
                className="grid grid-cols-8 gap-4 p-4 hover:bg-gray-50"
              >
                <div className="col-span-2 text-sm font-medium text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={currentUser.USERNAME}
                      onChange={(e) =>
                        setEditedUsers((prev) => ({
                          ...prev,
                          [user.EMAIL]: {
                            ...currentUser,
                            USERNAME: e.target.value,
                          },
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-2 text-sm"
                    />
                  ) : (
                    currentUser.USERNAME
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {currentUser.EMAIL}
                </div>
                <div>
                  {isEditing ? (
                    <select
                      value={currentUser.USE_YON}
                      onChange={(e) =>
                        setEditedUsers((prev) => ({
                          ...prev,
                          [user.EMAIL]: {
                            ...currentUser,
                            USE_YON: e.target.value as 'Y' | 'N',
                          },
                        }))
                      }
                      className="rounded-md border border-gray-300 px-2 text-sm"
                    >
                      <option value="Y">활성</option>
                      <option value="N">비활성</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        currentUser.USE_YON === 'Y'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {currentUser.USE_YON === 'Y' ? '활성' : '비활성'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {currentUser.LAST_LOGIN_AT &&
                      currentUser.LAST_LOGIN_AT.toLocaleString('ko-KR', {
                        timeZone: 'Asia/Seoul',
                      })}
                  </div>
                </div>
                <div className="col-span-2 flex justify-between gap-2">
                  <button
                    onClick={() => onEdit(currentUser)}
                    className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    {isEditing ? '취소' : '수정'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => onDelete(currentUser.EMAIL)}
                      className="w-full cursor-pointer rounded-md bg-red-100 px-2 py-1 text-xs text-gray-600 hover:bg-red-200"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
