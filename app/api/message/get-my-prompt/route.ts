import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: '사용자 ID 는 필수입니다.' },
        { status: 400 }
      );
    }

    const res = await message_query_management.getMyPrompt(userId);

    return NextResponse.json(res);
  } catch (err) {
    console.error('프롬프트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '프롬프트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
