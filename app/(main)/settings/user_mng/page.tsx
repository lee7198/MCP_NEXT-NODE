'use client';

import React, { useState } from 'react';
import { common_management } from '@/app/services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { UserListRes } from '@/app/types';
import { AddUserForm } from './components/AddUserForm';
import { UserTable } from './components/UserTable';
import Link from 'next/link';
import { CaretLeftIcon } from '@phosphor-icons/react/dist/ssr';

export default function User_mng() {
  const queryClient = useQueryClient();
  const [editedUsers, setEditedUsers] = useState<Record<string, UserListRes>>(
    {}
  );
  const [isAddingUser, setIsAddingUser] = useState(false);

  const {
    data: users,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['user_list'],
    queryFn: async () => common_management.getUserList(),
  });

  const updateUserMutation = useMutation({
    mutationFn: async (users: UserListRes[]) => {
      return common_management.updateUsers(users);
    },
    onSuccess: () => {
      toast.success('성공적으로 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['user_list'] });
      setEditedUsers({});
    },
  });

  const addUserMutation = useMutation({
    mutationFn: async (user: Partial<UserListRes>) => {
      return common_management.addUser(user);
    },
    onSuccess: () => {
      toast.success('사용자가 성공적으로 추가되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['user_list'] });
      setIsAddingUser(false);
    },
    onError: (error: Error) => {
      if (error.message === '이미 존재하는 이메일입니다.') {
        toast.error('이미 존재하는 이메일입니다.');
      } else {
        toast.error('사용자 추가에 실패했습니다.');
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (email: string) => {
      return common_management.deleteUser(email);
    },
    onSuccess: () => {
      toast.success('사용자가 성공적으로 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: ['user_list'] });
      setEditedUsers({});
    },
    onError: (error: Error) => {
      if (error.message === '존재하지 않는 사용자입니다.') {
        toast.error('존재하지 않는 사용자입니다.');
      } else {
        toast.error('사용자 삭제에 실패했습니다.');
      }
    },
  });

  const handleEdit = (user: UserListRes) => {
    if (editedUsers[user.EMAIL]) {
      setEditedUsers((prev) => {
        const newState = { ...prev };
        delete newState[user.EMAIL];
        return newState;
      });
    } else {
      setEditedUsers((prev) => ({
        ...prev,
        [user.EMAIL]: { ...user },
      }));
    }
  };

  const handleSave = () => {
    const usersToUpdate = Object.values(editedUsers);
    if (usersToUpdate.length > 0) {
      updateUserMutation.mutate(usersToUpdate);
    }
  };

  const handleAddUser = (user: Partial<UserListRes>) => {
    if (!user.USERNAME || !user.EMAIL) {
      toast.error('이름과 이메일을 모두 입력해주세요.');
      return;
    }
    addUserMutation.mutate(user);
  };

  const handleDelete = (email: string) => {
    if (window.confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      deleteUserMutation.mutate(email);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Link href="/settings">
            <CaretLeftIcon size={24} weight="bold" />
          </Link>
          <span>사용자 관리</span>
        </h1>
        <div className="flex gap-2">
          {Object.keys(editedUsers).length === 0 && !isAddingUser && (
            <button
              onClick={() => {
                if (isSuccess) setIsAddingUser(true);
              }}
              className="cursor-pointer rounded-md bg-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700"
            >
              사용자 추가
            </button>
          )}
          {Object.keys(editedUsers).length > 0 && (
            <button
              onClick={handleSave}
              className="cursor-pointer rounded-md bg-gray-600 px-4 py-2 text-xs font-medium text-white hover:bg-gray-700"
            >
              변경사항 저장
            </button>
          )}
        </div>
      </div>
      <div className="overflow-auto rounded-lg bg-white shadow">
        {/* Grid Header */}
        <div className="grid grid-cols-8 gap-4 bg-gray-50 p-4 text-xs font-medium tracking-wider text-gray-500 uppercase">
          <div className="col-span-2">이름</div>
          <div className="col-span-2">이메일</div>
          <div>사용유무</div>
          <div>마지막 접속</div>
          <div className="col-span-2">작업</div>
        </div>
        {isAddingUser && (
          <AddUserForm
            onAdd={handleAddUser}
            onCancel={() => setIsAddingUser(false)}
          />
        )}

        <UserTable
          users={isSuccess ? users : []}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editedUsers={editedUsers}
          setEditedUsers={setEditedUsers}
          isSuccess={isSuccess}
          isPending={isPending}
        />
      </div>
    </div>
  );
}
