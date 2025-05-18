export interface Message {
  id?: string | number;
  USER_ID: string;
  CONTENT: string;
  CREATED_AT: Date;
  isUser?: boolean;
  isLoading?: boolean;
}

export interface MessagesResponse {
  messages: Message[];
}

export interface ChatRes extends Message {
  res: string;
}

export interface ChatReq {
  content: string;
  USER_ID: string;
  id: string;
}
