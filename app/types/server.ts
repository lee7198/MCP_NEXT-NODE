import { ServerStatus } from './components';

export interface SaveServerForm {
  SERVERNAME: string;
  COMMENT: string;
}

export interface ServerDetailPageProps {
  params: { serverName: string };
}

export interface ServerHeaderProps {
  serverName: string;
  toggleEdit: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  onEdit: () => void;
  onDelete: () => void;
  status: ServerStatus;
}

export interface ServerDescriptionProps {
  isLoading: boolean;
  isEditing: boolean;
  toggleEdit: boolean;
  comment: string;
  editedComment: string;
  isUpdating: boolean;
  onCommentChange: (value: string) => void;
  onSave: () => void;
}

export interface ServerInfoProps {
  isLoading: boolean;
  serverName: string;
  responsedAt?: Date;
}
