import { NextRequest, NextResponse } from 'next/server';
import { server_query_management } from '@/app/lib/db/queries';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return NextResponse.json(
        { error: 'SERVER ID는 필수입니다.' },
        { status: 400 }
      );
    }

    await server_query_management.deleteServer(serverId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('서버 삭제 실패:', err);
    const errorMessage = err instanceof Error ? err.message : '서버 삭제 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
