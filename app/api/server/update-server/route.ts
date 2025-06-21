import { NextRequest, NextResponse } from 'next/server';
import { server_query_management } from '@/app/lib/db/queries';

export async function PUT(req: NextRequest) {
  try {
    const { serverId, comment } = await req.json();

    if (!serverId || !comment) {
      return NextResponse.json(
        { error: 'serverId와 comment는 필수입니다.' },
        { status: 400 }
      );
    }

    await server_query_management.updateServer(serverId, comment);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('서버 정보 수정 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '서버 정보 수정 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
