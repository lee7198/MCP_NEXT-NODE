import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';
import { randomUUID } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { USER_ID } = await req.json();
    if (!USER_ID) {
      return NextResponse.json(
        { error: 'USER_ID는 필수입니다.' },
        { status: 400 }
      );
    }
    const roomHash = randomUUID();
    await message_query_management.createChatRoom(USER_ID, roomHash);
    return NextResponse.json({ roomHash });
  } catch (err) {
    console.error('채팅방 생성 실패:', err);
    const msg = err instanceof Error ? err.message : '채팅방 생성 실패';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
