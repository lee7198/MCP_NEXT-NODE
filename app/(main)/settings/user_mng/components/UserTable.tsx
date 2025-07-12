import React from 'react';
import { UserTableProps } from '@/app/types';
import {
  GRID_STYLES,
  GridHeader,
  LoadingSkeleton,
  EditableInput,
  ActionButton,
  getColSpanClass,
  getGridRowClassDefault,
} from '@/app/components/common/GridStyles';
import { formatISOToKorean } from '@/app/lib/common';

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onEdit,
  onDelete,
  editedUsers,
  setEditedUsers,
  isPending,
}) => {
  const columns = [
    { label: '사용자명', span: 2 },
    { label: '이메일', span: 2 },
    { label: '상태', span: 1 },
    { label: '마지막 로그인', span: 2 },
    { label: '작업', span: 1 },
  ];

  if (isPending) {
    return (
      <div className={GRID_STYLES.container}>
        <GridHeader columns={columns} />
        <LoadingSkeleton columns={columns} />
      </div>
    );
  }

  return (
    <div className={GRID_STYLES.container}>
      <GridHeader columns={columns} />
      <div className={GRID_STYLES.divider}>
        {users.map((user) => {
          const isEditing = editedUsers[user.EMAIL];
          const currentUser = isEditing || user;

          return (
            <div
              key={user.EMAIL}
              className={getGridRowClassDefault(
                columns.reduce((acc, col) => acc + col.span, 0)
              )}
            >
              {/* 사용자명 */}
              <div className={getColSpanClass(columns[0].span)}>
                {isEditing ? (
                  <EditableInput
                    value={currentUser.USERNAME}
                    onChange={(value) =>
                      setEditedUsers((prev) => ({
                        ...prev,
                        [user.EMAIL]: {
                          ...currentUser,
                          USERNAME: value,
                        },
                      }))
                    }
                  />
                ) : (
                  <span className={GRID_STYLES.cellMedium}>
                    {currentUser.USERNAME}
                  </span>
                )}
              </div>
              {/* 이메일 */}
              <div className={getColSpanClass(columns[1].span)}>
                <span className={GRID_STYLES.cellMuted}>
                  {currentUser.EMAIL}
                </span>
              </div>
              {/* 상태 */}
              <div className={getColSpanClass(columns[2].span)}>
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
                    className={GRID_STYLES.input}
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
              {/* 마지막 로그인 */}
              <div className={getColSpanClass(columns[3].span)}>
                <span className={GRID_STYLES.cellMuted}>
                  {currentUser.LAST_LOGIN_AT &&
                    formatISOToKorean(currentUser.LAST_LOGIN_AT)}
                </span>
              </div>
              {/* 작업 */}
              <div
                className={`${getColSpanClass(columns[4].span)} ${GRID_STYLES.actions}`}
              >
                <ActionButton onClick={() => onEdit(currentUser)}>
                  {isEditing ? '취소' : '수정'}
                </ActionButton>
                {isEditing && (
                  <ActionButton
                    onClick={() => onDelete(currentUser.EMAIL)}
                    variant="danger"
                  >
                    삭제
                  </ActionButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
