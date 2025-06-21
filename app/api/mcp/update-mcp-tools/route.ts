import { mcp_query_management } from '@/app/lib/db/queries';
import { McpToolRes } from '@/app/types';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { tools }: { tools: McpToolRes[] } = await request.json();

    if (!tools || !Array.isArray(tools)) {
      return NextResponse.json(
        { error: 'tools 배열은 필수입니다.' },
        { status: 400 }
      );
    }

    mcp_query_management.updateMcpTools(tools);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('사용자 정보 수정 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : '사용자 정보 수정 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
