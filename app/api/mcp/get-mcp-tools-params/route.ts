import { NextRequest, NextResponse } from 'next/server';
import { mcp_query_management } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serverName = searchParams.get('SERVERNAME');

    if (!serverName) {
      return NextResponse.json(
        { error: 'serverName은 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await mcp_query_management.getMcpToolParams(serverName);
    return NextResponse.json(result);
  } catch (err) {
    console.error('서버 리스트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '서버 리스트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
