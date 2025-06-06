import { NextRequest, NextResponse } from 'next/server';
import { getCheckUser } from '@/app/lib/db/queries';

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
    const res = await getCheckUser(email);
    return NextResponse.json(res);
  } catch (err) {
    console.error('유저 리스트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '유저 리스트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
