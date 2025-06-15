import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { messageId, content, clientId } = await req.json();
    if (!messageId || !content || !clientId) {
      return NextResponse.json(
        { error: 'messageId, content, clientId는 필수입니다.' },
        { status: 400 }
      );
    }
    const responseId = await message_query_management.saveMcpResponse(
      messageId,
      content,
      clientId
    );
    return NextResponse.json({
      success: true,
      id: responseId,
      messageId,
      content,
      clientId,
    });
  } catch (err) {
    console.error('MCP 응답 저장 실패:', err);
    return NextResponse.json({ error: 'MCP 응답 저장 실패' }, { status: 500 });
  }
}
