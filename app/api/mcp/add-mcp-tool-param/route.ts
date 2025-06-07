import { NextRequest, NextResponse } from 'next/server';
import { mcp_query_management } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const param = await req.json();

    if (!param.SERVERNAME || !param.TOOLNAME) {
      return NextResponse.json(
        { error: 'SERVERNAME과 TOOLNAME은 필수입니다.' },
        { status: 400 }
      );
    }

    const result = await mcp_query_management.addMcpToolParam(param);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error('MCP 툴 파라미터 추가 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'MCP 툴 파라미터 추가 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
