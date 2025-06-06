import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { tools } = await request.json();

    for (const tool of tools) {
      await sql`
        UPDATE MCP_TOOL_MST
        SET TOOLNAME = ${tool.TOOLNAME},
            TOOL_COMMENT = ${tool.TOOL_COMMENT}
        WHERE TOOLNAME = ${tool.TOOLNAME}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating MCP tools:', error);
    return NextResponse.json(
      { error: 'Failed to update MCP tools' },
      { status: 500 }
    );
  }
}
