import React from 'react';
import { UserTableProps } from '@/app/types';

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  editedUsers,
  setEditedUsers,
  isPending,
}) => {
  return (
    <div className="overflow-auto rounded-lg bg-white shadow dark:bg-zinc-800 dark:shadow-gray-900/20">
      {isPending ? (
        <div className="grid grid-cols-4 gap-4 p-4">
          <div className="my-1 h-4 w-12 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
          <div className="my-1 h-4 w-24 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
          <div className="my-1 h-4 w-10 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
          <div className="my-1 h-4 w-26 animate-pulse rounded-lg bg-gray-300 dark:bg-zinc-600" />
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-zinc-700">
          {users.map((user) => {
            const isEditing = editedUsers[user.EMAIL];
            const currentUser = isEditing || user;

            return (
              <div
                key={user.EMAIL}
                className="grid grid-cols-8 gap-4 p-4 hover:bg-gray-100 dark:hover:bg-zinc-700"
              >
                <div className="col-span-2 text-sm font-medium text-gray-900 dark:text-zinc-100">
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
                      className="w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                    />
                  ) : (
                    currentUser.USERNAME
                  )}
                </div>
                <div className="col-span-2 text-sm text-gray-500 dark:text-zinc-400">
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
                      className="rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-900 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100"
                    >
                      <option value="Y">활성</option>
                      <option value="N">비활성</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        currentUser.USE_YON === 'Y'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {currentUser.USE_YON === 'Y' ? '활성' : '비활성'}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-zinc-400">
                    {currentUser.LAST_LOGIN_AT &&
                      currentUser.LAST_LOGIN_AT.toLocaleString('ko-KR', {
                        timeZone: 'Asia/Seoul',
                      })}
                  </div>
                </div>
                <div className="col-span-2 flex justify-between gap-2">
                  <button
                    onClick={() => onEdit(currentUser)}
                    className="w-full cursor-pointer rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                  >
                    {isEditing ? '취소' : '수정'}
                  </button>
                  {isEditing && (
                    <button
                      onClick={() => onDelete(currentUser.EMAIL)}
                      className="w-full cursor-pointer rounded-md bg-red-100 px-2 py-1 text-xs text-gray-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
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
