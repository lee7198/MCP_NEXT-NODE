import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const cursor = searchParams.get('cursor') || undefined;
    const roomId = searchParams.get('roomId');
    const limit = Number(searchParams.get('limit')) || 20;

    if (!userId || !roomId) {
      return NextResponse.json(
        { error: '사용자 ID & room ID는 필수입니다.' },
        { status: 400 }
      );
    }

    const { messages, nextCursor } =
      await message_query_management.getChatMessages({
        userId,
        limit,
        cursor,
        roomId,
      });

    return NextResponse.json({
      messages,
      nextCursor,
      hasMore: !!nextCursor,
    });
  } catch (err) {
    console.error('메시지 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '메시지 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
