import { Message, ChatReq } from './message';

export interface ChatMessageProps {
  message: Message;
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

export interface MessageListProps {
  messages: Message[];
  userId: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface AIResponseChatProps {
  CONTENT: string;
  CREATED_AT: Date;
}
