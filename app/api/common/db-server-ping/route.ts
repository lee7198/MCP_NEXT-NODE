import { NextResponse } from 'next/server';
import oracledb from 'oracledb';

const dbConfig = {
  user: process.env.ORACLE_USER,
  password: process.env.ORACLE_PASSWORD,
  connectString: process.env.ORACLE_CONNECT_STRING,
};
export async function GET() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    return NextResponse.json({ message: 'ping 성공' });
  } catch (err) {
    console.error('db ping 조회 실패:', err);
    const errorMessage =
      err instanceof Error ? err.message : 'db ping 조회 실패';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('연결 종료 실패:', err);
      }
    }
  }
}
