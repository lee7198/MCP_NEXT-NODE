import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { promptName, promptContent, userId } = await req.json();

    if (!promptName || !promptContent || !userId) {
      return NextResponse.json(
        { error: 'promptName, promptContent, userId는 필수입니다.' },
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
    console.error('프롬프트 저장 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '프롬프트 저장 실패';

    // 중복 에러인 경우 409 Conflict 상태 코드 반환
    if (errorMessage.includes('이미 존재하는 프롬프트 이름입니다')) {
      return NextResponse.json({ error: errorMessage }, { status: 409 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
