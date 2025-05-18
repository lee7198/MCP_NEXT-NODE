import { getOracleConnection } from '@/app/lib/db/connection';
import oracledb from 'oracledb';

// 채팅 메시지 저장
export async function saveChatMessage(userId: string, content: string) {
  const connection = await getOracleConnection();
  try {
    const sql = `INSERT INTO chat_messages (user_id, content, created_at) 
                 VALUES (:userId, :content, SYSDATE) 
                 RETURNING id INTO :id`;
    const result = await connection.execute(
      sql,
      {
        userId,
        content,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );
    return result.outBinds?.id[0];
  } finally {
    await connection.close();
  }
}

// 채팅 메시지 불러오기 (최신순)
export async function getChatMessages(userId: string, limit = 50) {
  if (!userId) {
    throw new Error('사용자 ID가 필요합니다.');
  }

  const connection = await getOracleConnection();
  try {
    const sql = `SELECT ID, USER_ID, DBMS_LOB.SUBSTR(CONTENT, 4000, 1) as CONTENT, CREATED_AT 
    FROM (SELECT * FROM chat_messages WHERE user_id = :userId ORDER BY created_at DESC) 
    WHERE ROWNUM <= :limit`;

    const result = await connection.execute(
      sql,
      { userId, limit },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows || result.rows.length === 0) {
      return [];
    }

    return result.rows;
  } catch (err) {
    console.error('메시지 조회 중 오류 발생:', err);
    throw new Error('메시지 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}
