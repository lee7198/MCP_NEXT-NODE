import { NextRequest, NextResponse } from 'next/server';
import { deleteUser } from '@/app/lib/db/queries';

export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: '이메일은 필수입니다.' },
        { status: 400 }
      );
    }

    await deleteUser(email);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('사용자 삭제 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '사용자 삭제 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
