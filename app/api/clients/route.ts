import { NextResponse } from 'next/server';
import { connectedClients } from '@/socket/server';

export async function GET() {
  return NextResponse.json(Array.from(connectedClients.values()));
}
