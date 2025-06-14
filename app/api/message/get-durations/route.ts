import { message_query_management } from '@/app/lib/db/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await message_query_management.getMessagesDuration();

    return NextResponse.json(res);
  } catch (err) {
    console.error('메세지 응답시간 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '메세지 응답시간 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
