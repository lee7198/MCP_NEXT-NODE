import { NextRequest, NextResponse } from 'next/server';
import { mcp_query_management } from '@/app/lib/db/queries';

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const TOOLNAME = searchParams.get('TOOLNAME');

    if (!TOOLNAME) {
      return NextResponse.json(
        { error: 'TOOLNAME은 필수입니다.' },
        { status: 400 }
      );
    }

    await mcp_query_management.deleteMcpTool(TOOLNAME);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('tool 삭제 실패:', err);
    const errorMessage = err instanceof Error ? err.message : 'tool 삭제 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
