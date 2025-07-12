import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function PUT(req: NextRequest) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return NextResponse.json(
        { error: 'orderNo, promptName, userId 필수입니다.' },
        { status: 400 }
      );
    }

    await message_query_management.updateUserPrompt(prompt, userId);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('프롬프트 수정 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '프롬프트 수정 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
