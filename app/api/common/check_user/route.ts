import { NextRequest, NextResponse } from 'next/server';
import { common_query_management } from '@/app/lib/db/queries';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: '이메일은 필수입니다.' },
        { status: 400 }
      );
    }

    const res = await common_query_management.getCheckUser(email);
    return NextResponse.json(res);
  } catch (err) {
    console.error('유저 확인 실패:', err);
    const errorMessage = err instanceof Error ? err.message : '유저 확인 실패';

    // 등록되지 않은 사용자인 경우 403 상태 코드로 응답
    if (errorMessage === '등록된 유저가 아닙니다.') {
      return NextResponse.json({ error: errorMessage }, { status: 403 });
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
