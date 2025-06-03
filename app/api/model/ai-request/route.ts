// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { Ollama } from 'ollama';

export async function POST(req: Request) {
  const { CONTENT, USER_ID, id } = await req.json();
  const prompt = CONTENT;
  try {
    const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

    const res = await ollama.chat({
      model: 'qwen3:8b',
      messages: [{ role: 'user', content: prompt }],
    });

    return NextResponse.json({ ...res, USER_ID, id });
  } catch {
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
