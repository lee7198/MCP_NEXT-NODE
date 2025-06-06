import { NextRequest, NextResponse } from 'next/server';
import { mcp_query_management } from '@/app/lib/db/queries';

export async function PUT(req: NextRequest) {
  try {
    const { serverId, toolName, useYon } = await req.json();

    if (!serverId || !toolName || !useYon) {
      return NextResponse.json(
        { error: 'serverId, toolName, useYon은 필수입니다.' },
        { status: 400 }
      );
    }

    await mcp_query_management.updateMcpToolUsage(serverId, toolName, useYon);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('MCP 도구 사용 여부 업데이트 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'MCP 도구 사용 여부 업데이트 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
