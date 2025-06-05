import { NextRequest, NextResponse } from 'next/server';
import { updateUsers } from '@/app/lib/db/queries';

export async function PUT(req: NextRequest) {
  try {
    const { users } = await req.json();

    if (!users || !Array.isArray(users)) {
      return NextResponse.json(
        { error: 'users 배열은 필수입니다.' },
        { status: 400 }
      );
    }

    await updateUsers(users);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '사용자 정보 수정 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
