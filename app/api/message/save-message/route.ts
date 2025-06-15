import { NextRequest, NextResponse } from 'next/server';
import { message_query_management } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { USER_ID, CONTENT, MCP_SERVER } = await req.json();
    if (!USER_ID || !CONTENT) {
      return NextResponse.json(
        { error: 'userId와 content는 필수입니다.' },
        { status: 400 }
      );
    }
    console.log('MCP_SERVER ', MCP_SERVER);
    const result_db = await message_query_management.saveChatMessage(
      USER_ID,
      CONTENT,
      MCP_SERVER
    );
    return NextResponse.json({
      success: true,
      id: result_db.id,
      CONTENT,
      USER_ID,
      MCP_SERVER: MCP_SERVER || undefined,
    });
  } catch (err) {
    console.error('메시지 저장 실패:', err);
    return NextResponse.json({ error: '메시지 저장 실패' }, { status: 500 });
  }
}
