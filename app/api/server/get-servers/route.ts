import { NextResponse } from 'next/server';
import { server_query_management } from '@/app/lib/db/queries';

export async function GET() {
  try {
    const rows = await server_query_management.getServerList();
    return NextResponse.json(rows);
  } catch (err) {
    console.error('서버 리스트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '서버 리스트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
