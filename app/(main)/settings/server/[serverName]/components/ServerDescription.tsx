import { ProgressCircle } from './ProgressCircle';
import { ServerDescriptionProps } from '@/app/types/server';

export const ServerDescription = ({
  isLoading,
  toggleEdit,
  comment,
  editedComment,
  isUpdating,
  onCommentChange,
  onSave,
}: ServerDescriptionProps) => {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h2 className="mb-4 text-lg font-semibold">서버 설명</h2>
      {isLoading ? (
        <div className="h-6 w-3/4 animate-pulse rounded-lg bg-gray-400" />
      ) : toggleEdit ? (
        <div className="space-y-4">
          <textarea
            value={editedComment}
            onChange={(e) => onCommentChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-gray-500 focus:outline-none"
            rows={4}
          />
          <button
            onClick={onSave}
            disabled={isUpdating}
            className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 disabled:opacity-50"
          >
            {isUpdating ? <ProgressCircle /> : '저장'}
          </button>
        </div>
      ) : (
        <p>{comment}</p>
      )}
    </div>
  );
};
