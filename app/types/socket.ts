export interface ClientInfo {
  uuid: string;
  clientId: string;
  connectedAt: Date;
  lastActivity: Date;
}

export interface ResponseClient {
  clientId: string;
}
