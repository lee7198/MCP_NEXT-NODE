import { ChatReq } from './api';
import { Message } from './message';

export interface ChatMessageProps {
  message: Message | 'alert' | 'error';
}

export interface ChatInputProps {
  onSendMessage: (content: ChatReq) => void;
  isDisabled: boolean;
  USER_ID: string;
}

export interface DateDividerProps {
  date?: string;
}

export interface MessageListProps {
  messages: Message[];
  userId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface ChatMessageProps {
  message: Message | 'alert' | 'error';
}

export interface MessageListProps {
  messages: Message[];
  userId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface ChatMessageProps {
  message: Message | 'alert' | 'error';
}
