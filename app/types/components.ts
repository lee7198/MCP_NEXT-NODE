import { Message, ChatReq } from './message';

export interface ChatMessageProps {
  message: Message;
  reqState: AIReqState;
  setReqState: React.Dispatch<React.SetStateAction<AIReqState>>;
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
  reqState: AIReqState;
  setReqState: React.Dispatch<React.SetStateAction<AIReqState>>;
}

export interface AIResponseChatProps {
  CONTENT: string;
  CREATED_AT: Date;
}

export interface AIReqState {
  messageId: number;
  isAIRes: boolean;
  isAIResSave: boolean;
}
