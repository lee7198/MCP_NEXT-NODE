export interface ChatRoom {
  ROOM_HASH: string;
  USER_ID: string;
  CREATED_AT: Date;
}

export interface ChatRoomsResponse {
  rooms: ChatRoom[];
}
