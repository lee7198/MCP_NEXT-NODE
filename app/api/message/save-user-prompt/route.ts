import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { promptName, promptContent, userId } = await req.json();

    if (!promptName || !promptContent || !userId) {
      return NextResponse.json(
        { error: 'promptName promptContent 필수입니다.' },
        { status: 400 }
      );
    }

    await message_query_management.saveUserPrompt(
      promptName,
      promptContent,
      userId
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('서버 등록 실패:', err);
    const errorMessage = err instanceof Error ? err.message : '서버 등록 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
