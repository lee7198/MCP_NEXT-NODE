import { NextRequest, NextResponse } from 'next/server';
import { getChatMessages } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const limit = Number(searchParams.get('limit')) || 50;

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    const rows = await getChatMessages(userId, limit);
    return NextResponse.json({ messages: rows });
  } catch (err) {
    console.error('메시지 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '메시지 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
