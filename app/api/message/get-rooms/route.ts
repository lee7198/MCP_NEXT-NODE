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
    const rooms = await message_query_management.getChatRooms(userId);
    return NextResponse.json({ rooms });
  } catch (err) {
    console.error('채팅방 조회 실패:', err);
    const msg = err instanceof Error ? err.message : '채팅방 조회 실패';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
