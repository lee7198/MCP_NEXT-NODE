// WebSocket 클라이언트 정보 관련 타입 정의
export interface ClientInfo {
  uuid: string;
  clientId: string;
  connectedAt: Date;
  lastActivity: Date;
}

export interface ResponseClient {
  clientId: string;
}
