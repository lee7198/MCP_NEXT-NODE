import { NextResponse } from 'next/server';

export async function GET() {
  const MODEL_PORT = process.env.MODEL_PORT;
  try {
    await fetch(`http://127.0.0.1:${MODEL_PORT}`);

    return NextResponse.json({ message: 'ping 성공' });
  } catch (err) {
    console.error('model ping 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'model ping 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
