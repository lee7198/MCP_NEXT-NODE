import { UserListRes } from './api';

export interface UserFormData {
  USERNAME: string;
  EMAIL: string;
  USE_YON: 'Y' | 'N';
}

export interface UserTableProps {
  users: UserListRes[];
  onEdit: (user: UserListRes) => void;
  onDelete: (email: string) => void;
  editedUsers: Record<string, UserListRes>;
  setEditedUsers: React.Dispatch<
    React.SetStateAction<Record<string, UserListRes>>
  >;
}

export interface AddUserFormProps {
  onAdd: (user: Partial<UserListRes>) => void;
  onCancel: () => void;
}
