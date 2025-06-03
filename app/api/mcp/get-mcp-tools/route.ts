import { NextRequest, NextResponse } from 'next/server';
import { getMcpList } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return NextResponse.json(
        { error: 'serverId는 필수입니다.' },
        { status: 400 }
      );
    }

    const rows = await getMcpList(serverId);
    return NextResponse.json(rows);
  } catch (err) {
    console.error('서버 리스트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '서버 리스트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
