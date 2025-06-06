import { NextRequest, NextResponse } from 'next/server';
import { addMcpTool } from '@/app/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    const { TOOLNAME, COMMENT } = await req.json();

    if (!TOOLNAME || !COMMENT) {
      return NextResponse.json(
        { error: 'TOOLNAME과 COMMENT는 필수입니다.' },
        { status: 400 }
      );
    }

    await addMcpTool({ TOOLNAME, COMMENT });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('Tool 등록 실패:', err);
    const errorMessage = err instanceof Error ? err.message : 'Tool 등록 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
