import {
  PencilSimpleIcon,
  TrashIcon,
  XIcon,
} from '@phosphor-icons/react/dist/ssr';

import { ProgressCircle } from './ProgressCircle';
import StatusPing from '../../../components/StatusPing';
import { ServerHeaderProps } from '@/app/types/server';

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
        <h1 className="text-2xl font-bold">{serverName}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onEdit}
          disabled={isEditing}
          className="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-300 active:ring-gray-500"
        >
          {toggleEdit ? (
            <XIcon size={20} color="#4b5563" />
          ) : (
            <PencilSimpleIcon size={20} color="#4b5563" />
          )}
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-300 active:ring-red-500 disabled:opacity-50"
        >
          {isDeleting ? (
            <ProgressCircle />
          ) : (
            <TrashIcon size={20} color="#e7000b" />
          )}
        </button>
      </div>
    </div>
  );
};
