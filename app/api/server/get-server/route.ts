import { NextRequest, NextResponse } from 'next/server';
import { server_query_management } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return NextResponse.json(
        { error: 'SERVER ID는 필수입니다.' },
        { status: 400 }
      );
    }

    const res = await server_query_management.getServerDetail(serverId);

    return NextResponse.json(res[0]);
  } catch (err) {
    console.error('서버 리스트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '서버 리스트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
