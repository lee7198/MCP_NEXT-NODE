import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function DELETE(req: NextRequest) {
  try {
    const { userId, roomId } = await req.json();

    if (!userId || !roomId) {
      return NextResponse.json(
        { error: 'userId와 roomId는 필수입니다.' },
        { status: 400 }
      );
    }

    await message_query_management.deleteFavoritesRoom(userId, roomId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('채팅방 즐겨찾기 삭제 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '채팅방 즐겨찾기 삭제 실패';

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
