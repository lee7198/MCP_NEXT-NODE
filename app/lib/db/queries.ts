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

// AI 응답 메시지 저장
export async function saveAIResponse(messageId: number, content: string) {
  const connection = await getOracleConnection();
  try {
    const sql = `INSERT INTO AI_RESPONSES (message_id, content, created_at) 
                 VALUES (:messageId, :content, SYSDATE) 
                 RETURNING id INTO :id`;
    const result = await connection.execute(
      sql,
      {
        messageId,
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

// AI 응답 메시지 불러오기
export async function getAIResponse(messageId: number) {
  const connection = await getOracleConnection();
  try {
    const sql = `SELECT ID, MESSAGE_ID, CONTENT, CREATED_AT 
                 FROM AI_RESPONSES 
                 WHERE message_id = :messageId`;

    const result = await connection.execute(
      sql,
      { messageId },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    // CLOB 데이터를 문자열로 변환
    if (row.CONTENT && typeof row.CONTENT.getData === 'function') {
      row.CONTENT = await row.CONTENT.getData();
    }

    return row;
  } catch (err) {
    console.error('AI 응답 조회 중 오류 발생:', err);
    throw new Error('AI 응답 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function getServerList() {
  const connection = await getOracleConnection();
  try {
    const sql = `SELECT * FROM SERVERS`;

    const result = await connection.execute(
      sql,
      {},
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    if (!result.rows || result.rows.length === 0) {
      return [];
    }

    return result.rows;
  } catch (err) {
    console.error('서버 리스트 조회 중 오류 발생:', err);
    throw new Error('서버 리스트 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function saveServer(SERVERNAME: string, COMMENT: string) {
  const connection = await getOracleConnection();
  try {
    // 중복 체크
    const checkResult = await connection.execute(
      'SELECT COUNT(*) as count FROM SERVERS WHERE SERVERNAME = :1',
      [SERVERNAME],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
      throw new Error('이미 존재하는 서버명입니다.');
    }

    // 서버 등록
    await connection.execute(
      'INSERT INTO SERVERS (SERVERNAME, "COMMENT", RESPONSED_AT) VALUES (:1, :2, SYSDATE)',
      [SERVERNAME, COMMENT],
      { autoCommit: true }
    );

    return {
      success: true,
      SERVERNAME,
      COMMENT,
    };
  } catch (err) {
    console.error('서버 등록 중 오류 발생:', err);
    throw err instanceof Error ? err : new Error('서버 등록에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function getServerDetail(serverId: string) {
  if (!serverId) {
    throw new Error('SERVER ID가 필요합니다.');
  }
  const connection = await getOracleConnection();
  try {
    const sql = `SELECT SERVERNAME, "COMMENT", RESPONSED_AT FROM SERVERS WHERE SERVERNAME = :serverId`;

    const result = await connection.execute(
      sql,
      { serverId },
      {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      }
    );

    if (!result.rows || result.rows.length === 0) {
      return [];
    }

    return result.rows;
  } catch (err) {
    console.error('서버 상세 조회 중 오류 발생:', err);
    throw new Error('서버 상세 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function deleteServer(serverId: string) {
  const connection = await getOracleConnection();
  try {
    await connection.execute(
      'DELETE FROM SERVERS WHERE SERVERNAME = :1',
      [serverId],
      { autoCommit: true }
    );
    return { success: true };
  } catch (err) {
    console.error('서버 삭제 중 오류 발생:', err);
    throw err instanceof Error ? err : new Error('서버 삭제에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function updateServer(serverId: string, comment: string) {
  const connection = await getOracleConnection();
  try {
    await connection.execute(
      'UPDATE SERVERS SET "COMMENT" = :1 WHERE SERVERNAME = :2',
      [comment, serverId],
      { autoCommit: true }
    );
    return { success: true };
  } catch (err) {
    console.error('서버 정보 수정 중 오류 발생:', err);
    throw err instanceof Error
      ? err
      : new Error('서버 정보 수정에 실패했습니다.');
  } finally {
    await connection.close();
  }
}
