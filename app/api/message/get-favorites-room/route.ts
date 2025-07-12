import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    const rooms = await message_query_management.getFavoritesRoom(userId);

    return NextResponse.json(rooms);
  } catch (err) {
    console.error('즐겨찾기 채팅방 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '즐겨찾기 채팅방 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
