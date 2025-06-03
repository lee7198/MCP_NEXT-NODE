import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = Number(searchParams.get('messageId'));

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId는 필수입니다.' },
        { status: 400 }
      );
    }

    const response = await getAIResponse(messageId);
    return NextResponse.json(response);
  } catch (err) {
    console.error('AI 응답 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'AI 응답 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
