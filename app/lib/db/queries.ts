import { getOracleConnection } from '@/app/lib/db/connection';
import oracledb from 'oracledb';
import { UserListRes } from '@/app/types';
import { McpToolRes } from '@/app/types/management';

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

export async function getMcpListUsage(serverId: string) {
  const connection = await getOracleConnection();
  try {
    // const sql = `SELECT * FROM MCP_TOOL_MST`;
    const sql = `
    SELECT 
    mtm.TOOLNAME AS TOOLNAME, 
    mtm."COMMENT" AS TOOL_COMMENT, 
    s.SERVERNAME, 
    COALESCE(mtum.USE_YON, 'N') AS USE_YON
FROM 
    MCP_TOOL_MST mtm
CROSS JOIN 
    SERVERS s
LEFT JOIN 
    MCP_TOOL_USAGE_MST mtum 
    ON mtm.TOOLNAME = mtum.TOOLNAME AND s.SERVERNAME = mtum.SERVERNAME
WHERE
    s.SERVERNAME = :serverId
ORDER BY 
    mtm.TOOLNAME, s.SERVERNAME
    `;

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
    console.error('MCP 정보 조회 중 오류 발생:', err);
    throw new Error('MCP 정보 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function updateMcpToolUsage(
  serverId: string,
  toolName: string,
  useYon: 'Y' | 'N'
) {
  const connection = await getOracleConnection();
  try {
    // 먼저 해당 레코드가 존재하는지 확인
    const checkResult = await connection.execute(
      'SELECT COUNT(*) as count FROM MCP_TOOL_USAGE_MST WHERE SERVERNAME = :1 AND TOOLNAME = :2',
      [serverId, toolName],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
      // 레코드가 존재하면 업데이트
      await connection.execute(
        'UPDATE MCP_TOOL_USAGE_MST SET USE_YON = :1 WHERE SERVERNAME = :2 AND TOOLNAME = :3',
        [useYon, serverId, toolName],
        { autoCommit: true }
      );
    } else {
      // 레코드가 없으면 새로 삽입
      await connection.execute(
        'INSERT INTO MCP_TOOL_USAGE_MST (SERVERNAME, TOOLNAME, USE_YON) VALUES (:1, :2, :3)',
        [serverId, toolName, useYon],
        { autoCommit: true }
      );
    }

    return { success: true };
  } catch (err) {
    console.error('MCP 도구 사용 여부 업데이트 중 오류 발생:', err);
    throw err instanceof Error
      ? err
      : new Error('MCP 도구 사용 여부 업데이트에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function getUserList() {
  const connection = await getOracleConnection();
  try {
    const sql = `SELECT * FROM USER_MST`;

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
    console.error('유저 리스트 조회 중 오류 발생:', err);
    throw new Error('유저 리스트 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function updateUsers(users: UserListRes[]) {
  const connection = await getOracleConnection();
  try {
    for (const user of users) {
      await connection.execute(
        'UPDATE USER_MST SET USERNAME = :1, USE_YON = :2 WHERE EMAIL = :3',
        [user.USERNAME, user.USE_YON, user.EMAIL],
        { autoCommit: true }
      );
    }
    return { success: true };
  } catch (err) {
    console.error('사용자 정보 수정 중 오류 발생:', err);
    throw err instanceof Error
      ? err
      : new Error('사용자 정보 수정에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function addUser(user: Partial<UserListRes>) {
  const connection = await getOracleConnection();
  try {
    const { USERNAME, EMAIL, USE_YON = 'Y' } = user;

    // 중복 체크
    const checkResult = await connection.execute(
      'SELECT COUNT(*) as count FROM USER_MST WHERE EMAIL = :1',
      [EMAIL],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    // 사용자 추가
    await connection.execute(
      'INSERT INTO USER_MST (USERNAME, EMAIL, USE_YON) VALUES (:1, :2, :3)',
      [USERNAME, EMAIL, USE_YON],
      { autoCommit: true }
    );

    return { success: true };
  } catch (err) {
    console.error('사용자 추가 중 오류 발생:', err);
    // 원본 에러 메시지를 유지
    if (err instanceof Error && err.message === '이미 존재하는 이메일입니다.') {
      throw err;
    }
    throw new Error('사용자 추가에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function deleteUser(email: string) {
  const connection = await getOracleConnection();
  try {
    // 사용자 존재 여부 확인
    const checkResult = await connection.execute(
      'SELECT COUNT(*) as count FROM USER_MST WHERE EMAIL = :1',
      [email],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows && checkResult.rows[0].COUNT === 0) {
      throw new Error('존재하지 않는 사용자입니다.');
    }

    // 사용자 삭제
    await connection.execute('DELETE FROM USER_MST WHERE EMAIL = :1', [email], {
      autoCommit: true,
    });

    return { success: true };
  } catch (err) {
    console.error('사용자 삭제 중 오류 발생:', err);
    if (err instanceof Error && err.message === '존재하지 않는 사용자입니다.') {
      throw err;
    }
    throw new Error('사용자 삭제에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function getCheckUser(email: string) {
  const connection = await getOracleConnection();
  try {
    const checkResult = await connection.execute(
      'SELECT COUNT(*) as count FROM USER_MST WHERE EMAIL = :1 AND USE_YON = :2',
      [email, 'Y'],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows && checkResult.rows[0].COUNT === 0)
      return { success: false };

    return { success: true };
  } catch (err) {
    console.error('유저 조회 중 오류 발생:', err);
    throw new Error('유저 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function getMcpList() {
  const connection = await getOracleConnection();
  try {
    const sql = `SELECT * FROM MCP_TOOL_MST`;

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
    console.error('MCP 리스트 조회 중 오류 발생:', err);
    throw new Error('MCP 리스트 조회에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function addMcpTool(req: Partial<McpToolRes>) {
  const { TOOLNAME, COMMENT } = req;
  const connection = await getOracleConnection();
  try {
    // 중복 체크
    const checkResult = await connection.execute(
      'SELECT COUNT(*) as count FROM MCP_TOOL_MST WHERE TOOLNAME = :1',
      [TOOLNAME],
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
      throw new Error('이미 존재하는 Tool 입니다.');
    }

    // tool 추가
    await connection.execute(
      'INSERT INTO MCP_TOOL_MST (TOOLNAME, "COMMENT") VALUES (:1, :2)',
      [TOOLNAME, COMMENT],
      { autoCommit: true }
    );

    return { success: true };
  } catch (err) {
    console.error('Tool 추가 중 오류 발생:', err);
    // 원본 에러 메시지를 유지
    if (err instanceof Error && err.message === '이미 존재하는 Tool 입니다.') {
      throw err;
    }
    throw new Error('Tool 추가에 실패했습니다.');
  } finally {
    await connection.close();
  }
}

export async function deleteMcpTool(TOOLNAME: string) {
  const connection = await getOracleConnection();
  try {
    await connection.execute(
      'DELETE FROM MCP_TOOL_MST WHERE TOOLNAME = :1',
      [TOOLNAME],
      { autoCommit: true }
    );
    return { success: true };
  } catch (err) {
    console.error('tool 삭제 중 오류 발생:', err);
    throw err instanceof Error ? err : new Error('tool 삭제에 실패했습니다.');
  } finally {
    await connection.close();
  }
}
