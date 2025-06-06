import { NextRequest, NextResponse } from 'next/server';
import { server_query_management } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { SERVERNAME, COMMENT } = await req.json();

    if (!SERVERNAME || !COMMENT) {
      return NextResponse.json(
        { error: 'SERVERNAME과 COMMENT는 필수입니다.' },
        { status: 400 }
      );
    }

    await server_query_management.saveServer(SERVERNAME, COMMENT);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('서버 등록 실패:', err);
    const errorMessage = err instanceof Error ? err.message : '서버 등록 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
