import { NextRequest, NextResponse } from 'next/server';
import { saveAIResponse } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { messageId, content } = await req.json();
    if (!messageId || !content) {
      return NextResponse.json(
        { error: 'messageId와 content는 필수입니다.' },
        { status: 400 }
      );
    }
    const responseId = await saveAIResponse(messageId, content);
    return NextResponse.json({
      success: true,
      id: responseId,
      messageId,
      content,
    });
  } catch (err) {
    console.error('AI 응답 저장 실패:', err);
    return NextResponse.json({ error: 'AI 응답 저장 실패' }, { status: 500 });
  }
}
