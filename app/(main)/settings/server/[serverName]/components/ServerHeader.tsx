import {
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';

import { ProgressCircle } from './ProgressCircle';
import StatusPing from '../../../components/StatusPing';
import { ServerHeaderProps } from '@/app/types';

export const ServerHeader = ({
  serverName,
  toggleEdit,
  isEditing,
  isDeleting,
  onEdit,
  onDelete,
  status,
}: ServerHeaderProps) => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <StatusPing status={status} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-zinc-100">
          {serverName}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={isEditing}
          className="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-300 active:ring-gray-500 dark:hover:bg-zinc-600 dark:active:ring-gray-400"
        >
          {toggleEdit ? (
            <XIcon size={20} className="text-gray-600 dark:text-zinc-400" />
          ) : (
            <PencilSimpleIcon
              size={20}
              className="text-gray-600 dark:text-zinc-400"
            />
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-300 active:ring-red-500 disabled:opacity-50 dark:hover:bg-zinc-600 dark:active:ring-red-400"
        >
          {isDeleting ? (
            <ProgressCircle />
          ) : (
            <TrashIcon size={20} className="text-red-600 dark:text-red-400" />
          )}
        </button>
      </div>
    </div>
  );
};
