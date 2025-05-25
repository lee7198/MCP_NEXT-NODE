import { NextRequest, NextResponse } from 'next/server';
import { saveChatMessage } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { USER_ID, CONTENT } = await req.json();
    if (!USER_ID || !CONTENT) {
      return NextResponse.json(
        { error: 'userId와 content는 필수입니다.' },
        { status: 400 }
      );
    }
    const messageId = await saveChatMessage(USER_ID, CONTENT);
    return NextResponse.json({
      success: true,
      id: messageId,
      CONTENT,
      USER_ID,
    });
  } catch (err) {
    console.error('메시지 저장 실패:', err);
    return NextResponse.json({ error: '메시지 저장 실패' }, { status: 500 });
  }
}
