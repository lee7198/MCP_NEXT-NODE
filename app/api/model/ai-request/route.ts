// app/api/chat/route.ts
import { NextResponse } from 'next/server';
import { Ollama } from 'ollama';
import { message_query_management } from '@/app/lib/db/queries';

export async function POST(req: Request) {
  const { CONTENT, USER_ID, id } = await req.json();
  const prompt = CONTENT;

  const MODEL_PORT = process.env.MODEL_PORT;

  try {
    const ollama = new Ollama({ host: `http://127.0.0.1:${MODEL_PORT}` });

    const res = await ollama.chat({
      model: 'qwen3:8b',
      messages: [{ role: 'user', content: prompt }],
    });

    // AI 응답을 비동기적으로 저장
    message_query_management
      .saveAIResponse(id, res.message.content, res.total_duration)
      .catch((error) => {
        console.error('AI 응답 저장 실패:', error);
      });

    return NextResponse.json({
      ...res,
      USER_ID,
      id,
      total_duration: res.total_duration,
    });
  } catch {
    return NextResponse.json(
      { error: 'AI 응답 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
