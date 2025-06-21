import { getOracleConnection } from '@/app/lib/db/connection';
import oracledb from 'oracledb';
import { DurationData, UserListRes } from '@/app/types';
import { McpToolRes } from '@/app/types';
import { McpParamsRes } from '@/app/types/api';

// 메시지 관리 관련 쿼리
export const message_query_management = {
  // 채팅 메시지 저장
  async saveChatMessage(userId: string, content: string, MCP_SERVER?: string) {
    const connection = await getOracleConnection();
    try {
      const sql = `INSERT INTO chat_messages (user_id, content, created_at, mcp_server) 
                   VALUES (:userId, :content, SYSDATE, :mcp_server) 
                   RETURNING id INTO :id`;

      const result = await connection.execute(
        sql,
        {
          userId,
          content,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          mcp_server: MCP_SERVER || null,
        },
        { autoCommit: true }
      );

      // 저장된 메시지의 mcp_server 값을 조회
      const selectSql = `SELECT mcp_server FROM chat_messages WHERE id = :id`;
      const selectResult = await connection.execute(
        selectSql,
        { id: result.outBinds?.id[0] },
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return {
        id: result.outBinds?.id[0],
        mcp_server: selectResult.rows?.[0]?.MCP_SERVER,
      };
    } finally {
      await connection.close();
    }
  },

  // 채팅 메시지 불러오기 (최신순)
  async getChatMessages(userId: string, limit = 20, cursor?: string) {
    if (!userId) {
      throw new Error('사용자 ID가 필요합니다.');
    }

    const connection = await getOracleConnection();
    try {
      const sql = `
        SELECT ID, USER_ID, DBMS_LOB.SUBSTR(CONTENT, 4000, 1) as CONTENT, CREATED_AT 
        FROM (
          SELECT * FROM chat_messages 
          WHERE user_id = :userId 
          ${cursor ? 'AND CREATED_AT < :cursor' : ''}
          ORDER BY created_at DESC
        ) 
        WHERE ROWNUM <= :limit
      `;

      const params: { userId: string; limit: number; cursor?: Date } = {
        userId,
        limit,
      };
      if (cursor) {
        params.cursor = new Date(cursor);
      }

      const result = await connection.execute(sql, params, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
      });

      if (!result.rows || result.rows.length === 0) {
        return { messages: [], nextCursor: null };
      }

      const messages = result.rows;
      const nextCursor =
        messages.length === limit
          ? messages[messages.length - 1].CREATED_AT
          : null;

      return { messages, nextCursor };
    } catch (err) {
      console.error('메시지 조회 중 오류 발생:', err);
      throw new Error('메시지 조회에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  // AI 응답 메시지 저장
  async saveAIResponse(
    messageId: number,
    content: string,
    total_duration: number
  ) {
    const connection = await getOracleConnection();
    try {
      const sql = `INSERT INTO AI_RESPONSES (message_id, content, created_at, total_duration) 
                   VALUES (:messageId, :content, SYSDATE, :total_duration) 
                   RETURNING id INTO :id`;
      const result = await connection.execute(
        sql,
        {
          messageId,
          content,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
          total_duration,
        },
        { autoCommit: true }
      );
      return result.outBinds?.id[0];
    } finally {
      await connection.close();
    }
  },

  // AI 응답 메시지 불러오기
  async getAIResponse(messageId: number) {
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
  },

  // MCP 응답 메시지 저장
  async saveMcpResponse(messageId: number, content: string, clientId: string) {
    const connection = await getOracleConnection();
    try {
      const sql = `INSERT INTO AI_RESPONSES (message_id, content, created_at, client_id) 
                   VALUES (:messageId, :content, SYSDATE, :clientId) 
                   RETURNING id INTO :id`;
      const result = await connection.execute(
        sql,
        {
          messageId,
          content,
          clientId,
          id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        },
        { autoCommit: true }
      );
      return result.outBinds?.id[0];
    } finally {
      await connection.close();
    }
  },

  async getMessagesDuration(): Promise<DurationData[]> {
    const connection = await getOracleConnection();
    try {
      const sql = `
SELECT 
	um.USERNAME,
	ar.CREATED_AT,
	ar.TOTAL_DURATION
FROM
	CHAT_MESSAGES cm,
	AI_RESPONSES  ar,
	USER_MST um 
WHERE
	cm.USER_ID = um.EMAIL 
	AND cm.ID = ar.MESSAGE_ID
    AND ar.CREATED_AT >= ADD_MONTHS(SYSDATE, -1)
ORDER BY ar.CREATED_AT DESC`;

      const result = await connection.execute(
        sql,
        {},
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (!result.rows || result.rows.length === 0) {
        return [];
      }
      return result.rows;
    } catch (err) {
      console.error('메세지 응답시간 조회 중 오류 발생:', err);
      throw new Error('메세지 응답시간 조회에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },
};

// 서버 관리 관련 쿼리
export const server_query_management = {
  async getServerList() {
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
  },

  async saveServer(SERVERNAME: string, COMMENT: string) {
    const connection = await getOracleConnection();
    try {
      const checkResult = await connection.execute(
        'SELECT COUNT(*) as count FROM SERVERS WHERE SERVERNAME = :1',
        [SERVERNAME],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
        throw new Error('이미 존재하는 서버명입니다.');
      }

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
  },

  async getServerDetail(serverId: string) {
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
  },

  async deleteServer(serverId: string) {
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
  },

  async updateServer(serverId: string, comment: string) {
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
  },
};

// MCP 관리 관련 쿼리
export const mcp_query_management = {
  async getMcpListUsage(serverId: string) {
    const connection = await getOracleConnection();
    try {
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
  },

  async updateMcpToolUsage(
    serverId: string,
    toolName: string,
    useYon: 'Y' | 'N'
  ) {
    const connection = await getOracleConnection();
    try {
      const checkResult = await connection.execute(
        'SELECT COUNT(*) as count FROM MCP_TOOL_USAGE_MST WHERE SERVERNAME = :1 AND TOOLNAME = :2',
        [serverId, toolName],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
        await connection.execute(
          'UPDATE MCP_TOOL_USAGE_MST SET USE_YON = :1 WHERE SERVERNAME = :2 AND TOOLNAME = :3',
          [useYon, serverId, toolName],
          { autoCommit: true }
        );
      } else {
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
  },

  async getMcpList() {
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
  },

  async addMcpTool(req: Partial<McpToolRes>) {
    const { TOOLNAME, COMMENT } = req;
    const connection = await getOracleConnection();
    try {
      const checkResult = await connection.execute(
        'SELECT COUNT(*) as count FROM MCP_TOOL_MST WHERE TOOLNAME = :1',
        [TOOLNAME],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
        throw new Error('이미 존재하는 Tool 입니다.');
      }

      await connection.execute(
        'INSERT INTO MCP_TOOL_MST (TOOLNAME, "COMMENT") VALUES (:1, :2)',
        [TOOLNAME, COMMENT],
        { autoCommit: true }
      );

      return { success: true };
    } catch (err) {
      console.error('Tool 추가 중 오류 발생:', err);
      if (
        err instanceof Error &&
        err.message === '이미 존재하는 Tool 입니다.'
      ) {
        throw err;
      }
      throw new Error('Tool 추가에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async deleteMcpTool(TOOLNAME: string) {
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
  },

  async updateMcpTools(mcpList: Partial<McpToolRes>[]) {
    const connection = await getOracleConnection();
    try {
      for (const mcp of mcpList) {
        if (mcp.TOOLNAME && mcp.COMMENT) {
          await connection.execute(
            'UPDATE MCP_TOOL_MST SET "COMMENT" = :1 WHERE TOOLNAME = :2',
            [mcp.COMMENT, mcp.TOOLNAME],
            { autoCommit: true }
          );
        }
      }
      return { success: true };
    } catch (err) {
      console.error('tool 정보 수정 중 오류 발생:', err);
      throw err instanceof Error
        ? err
        : new Error('tool 정보 수정에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async getMcpToolParams(serverName: string, toolName?: string) {
    const connection = await getOracleConnection();
    try {
      const sql = toolName
        ? `SELECT * FROM MCP_TOOL_USAGE_DTL 
                   WHERE SERVERNAME = :1 AND TOOLNAME = :2 
                   ORDER BY ORDER_NO ASC`
        : `SELECT * FROM MCP_TOOL_USAGE_DTL 
                   WHERE SERVERNAME = :1 
                   ORDER BY ORDER_NO ASC`;

      const result = await connection.execute(
        sql,
        toolName ? [serverName, toolName] : [serverName],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      if (!result.rows || result.rows.length === 0) {
        return [];
      }

      return result.rows;
    } catch (err) {
      console.error('MCP Params 조회 중 오류 발생:', err);
      throw new Error('MCP Params 조회에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async updateMcpToolParams(param: McpParamsRes) {
    const connection = await getOracleConnection();
    try {
      // ORDER_NO가 변경되는 경우 중복 체크
      const checkResult = await connection.execute(
        `SELECT COUNT(*) as count 
         FROM MCP_TOOL_USAGE_DTL 
         WHERE SERVERNAME = :1 
         AND TOOLNAME = :2 
         AND ORDER_NO = :3 
         AND ORDER_NO != :4`,
        [param.SERVERNAME, param.TOOLNAME, param.ORDER_NO, param.ORDER_NO],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
        throw new Error('이미 존재하는 순서 번호입니다.');
      }

      await connection.execute(
        `UPDATE MCP_TOOL_USAGE_DTL 
         SET ARGUMENT = :1, "COMMENT" = :2, ORDER_NO = :3
         WHERE SERVERNAME = :4 AND TOOLNAME = :5 AND ORDER_NO = :6`,
        [
          param.ARGUMENT,
          param.COMMENT,
          param.ORDER_NO,
          param.SERVERNAME,
          param.TOOLNAME,
          param.ORDER_NO,
        ],
        { autoCommit: true }
      );
      return { success: true };
    } catch (err) {
      console.error('MCP 파라미터 수정 중 오류 발생:', err);
      if (
        err instanceof Error &&
        err.message === '이미 존재하는 순서 번호입니다.'
      ) {
        throw err;
      }
      throw new Error('MCP 파라미터 수정에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async addMcpToolParam(param: Partial<McpParamsRes>) {
    const connection = await getOracleConnection();
    try {
      // 현재 최대 ORDER_NO 조회
      const maxOrderResult = await connection.execute(
        `SELECT NVL(MAX(ORDER_NO), 0) as max_order 
         FROM MCP_TOOL_USAGE_DTL 
         WHERE SERVERNAME = :1 AND TOOLNAME = :2`,
        [param.SERVERNAME, param.TOOLNAME],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      const newOrderNo = (maxOrderResult.rows?.[0]?.MAX_ORDER || 0) + 1;

      await connection.execute(
        `INSERT INTO MCP_TOOL_USAGE_DTL 
         (SERVERNAME, TOOLNAME, ARGUMENT, ORDER_NO, "COMMENT") 
         VALUES (:1, :2, :3, :4, :5)`,
        [
          param.SERVERNAME,
          param.TOOLNAME,
          param.ARGUMENT,
          newOrderNo,
          param.COMMENT,
        ],
        { autoCommit: true }
      );

      return { success: true, orderNo: newOrderNo };
    } catch (err) {
      console.error('MCP 파라미터 추가 중 오류 발생:', err);
      throw new Error('MCP 파라미터 추가에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async deleteMcpToolParams(param: McpParamsRes) {
    const connection = await getOracleConnection();
    try {
      await connection.execute(
        `DELETE FROM MCP_TOOL_USAGE_DTL 
         WHERE SERVERNAME = :1 
         AND TOOLNAME = :2 
         AND ORDER_NO = :3`,
        [param.SERVERNAME, param.TOOLNAME, param.ORDER_NO],
        { autoCommit: true }
      );
      return { success: true };
    } catch (err) {
      console.error('MCP 파라미터 삭제 중 오류 발생:', err);
      throw new Error('MCP 파라미터 삭제에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },
};

// 공통 관리 관련 쿼리
export const common_query_management = {
  async getUserList() {
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
  },

  async updateUsers(users: UserListRes[]) {
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
  },

  async addUser(user: Partial<UserListRes>) {
    const connection = await getOracleConnection();
    try {
      const { USERNAME, EMAIL, USE_YON = 'Y' } = user;

      const checkResult = await connection.execute(
        'SELECT COUNT(*) as count FROM USER_MST WHERE EMAIL = :1',
        [EMAIL],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT > 0) {
        throw new Error('이미 존재하는 이메일입니다.');
      }

      await connection.execute(
        'INSERT INTO USER_MST (USERNAME, EMAIL, USE_YON) VALUES (:1, :2, :3)',
        [USERNAME, EMAIL, USE_YON],
        { autoCommit: true }
      );

      return { success: true };
    } catch (err) {
      console.error('사용자 추가 중 오류 발생:', err);
      if (
        err instanceof Error &&
        err.message === '이미 존재하는 이메일입니다.'
      ) {
        throw err;
      }
      throw new Error('사용자 추가에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async deleteUser(email: string) {
    const connection = await getOracleConnection();
    try {
      const checkResult = await connection.execute(
        'SELECT COUNT(*) as count FROM USER_MST WHERE EMAIL = :1',
        [email],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT === 0) {
        throw new Error('존재하지 않는 사용자입니다.');
      }

      await connection.execute(
        'DELETE FROM USER_MST WHERE EMAIL = :1',
        [email],
        {
          autoCommit: true,
        }
      );

      return { success: true };
    } catch (err) {
      console.error('사용자 삭제 중 오류 발생:', err);
      if (
        err instanceof Error &&
        err.message === '존재하지 않는 사용자입니다.'
      ) {
        throw err;
      }
      throw new Error('사용자 삭제에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },

  async getCheckUser(email: string) {
    const connection = await getOracleConnection();
    try {
      const checkResult = await connection.execute(
        'SELECT COUNT(*) as count FROM USER_MST WHERE EMAIL = :1 AND USE_YON = :2',
        [email, 'Y'],
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      if (checkResult.rows && checkResult.rows[0].COUNT === 0) {
        throw new Error('등록된 유저가 아닙니다.');
      }

      await connection.execute(
        'UPDATE USER_MST SET LAST_LOGIN_AT = SYSDATE WHERE EMAIL = :1',
        [email],
        { autoCommit: true }
      );

      return { success: true };
    } catch (err) {
      console.error('유저 조회 중 오류 발생:', err);
      throw err instanceof Error ? err : new Error('유저 조회에 실패했습니다.');
    } finally {
      await connection.close();
    }
  },
};
