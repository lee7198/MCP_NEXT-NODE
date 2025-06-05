import { NextRequest, NextResponse } from 'next/server';
import { addUser } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { user } = await req.json();

    if (!user || !user.USERNAME || !user.EMAIL) {
      return NextResponse.json(
        { error: 'USERNAME과 EMAIL은 필수입니다.' },
        { status: 400 }
      );
    }

    await addUser(user);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('사용자 추가 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '사용자 추가 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
