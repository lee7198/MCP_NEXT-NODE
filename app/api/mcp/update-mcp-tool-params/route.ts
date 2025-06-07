import { NextRequest, NextResponse } from 'next/server';
import { mcp_query_management } from '@/app/lib/db/queries';

export async function PUT(req: NextRequest) {
  try {
    const param = await req.json();

    if (!param.SERVERNAME || !param.TOOLNAME || !param.ORDER_NO) {
      return NextResponse.json(
        { error: 'SERVERNAME, TOOLNAME, ORDER_NO는 필수입니다.' },
        { status: 400 }
      );
    }

    await mcp_query_management.updateMcpToolParams(param);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('MCP 툴 파라미터 업데이트 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'MCP 툴 파라미터 업데이트 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
