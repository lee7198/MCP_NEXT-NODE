import { NextResponse } from 'next/server';
import { getUserList } from '@/app/lib/db/queries';

export async function GET() {
  try {
    const rows = await getUserList();
    return NextResponse.json(rows);
  } catch (err) {
    console.error('유저 리스트 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '유저 리스트 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
